import os
import mir_eval
import pretty_midi as pm
from chordmodel.utils import logger
# from btc_model import *
from chordmodel.btc_model import *
from chordmodel.utils.mir_eval_modules import audio_file_to_features, idx2chord, idx2voca_chord, get_audio_paths
import argparse
import warnings

def run_chord_model():
    print("run_chord_model")
    warnings.filterwarnings('ignore')
    logger.logging_verbosity(1)
    use_cuda = torch.cuda.is_available()
    device = torch.device("cuda" if use_cuda else "cpu")

    # hyperparameters
    # parser = argparse.ArgumentParser()
    # parser.add_argument('--voca', default=True, type=lambda x: (str(x).lower() == 'true'))
    # parser.add_argument('--audio_dir', type=str, default='./test')
    # parser.add_argument('--save_dir', type=str, default='./test')
    # args = parser.parse_args()

    audio_dir = './chordmodel/test'
    save_dir = './chordmodel/test'
    voca = True
    print("voca: ", voca, "audio_dir: ", audio_dir, "save_dir: ", save_dir)
    
    yaml_path = os.path.join(os.getcwd(), 'chordmodel', "run_config.yaml")
    if os.path.isfile(yaml_path):
        print(f"Found YAML at {yaml_path}")
        config = HParams.load(yaml_path)
        print("loaded hpparams: ", config)
    else:
        print(f"YAML file not found at {yaml_path}")
        # Handle the error as appropriate
        raise FileNotFoundError(f"YAML file not found at {yaml_path}")
    

    if voca is True:
        print("voca is True")
        config.feature['large_voca'] = True
        config.model['num_chords'] = 170
        model_file = './test/btc_model_large_voca.pt'
        idx_to_chord = idx2voca_chord()
        logger.info("label type: large voca")
    else:
        print("voca is False")
        model_file = './test/btc_model.pt'
        idx_to_chord = idx2chord
        logger.info("label type: Major and minor")

    # model = BTC_model(config=config.model).to(device)
    model = BTC_model(config=config.model).to(device)

    mean = 0
    std = 1
    # Load model
    print("Loading model")
    if os.path.isfile(model_file):
        checkpoint = torch.load(model_file, map_location=torch.device('cpu'))
        mean = checkpoint['mean']
        std = checkpoint['std']
        model.load_state_dict(checkpoint['model'])
        logger.info("restore model")

    # Audio files with format of wav and mp3
    audio_paths = get_audio_paths(audio_dir)
    print("audio_paths: ", audio_paths)

    # Chord recognition and save lab file
    for i, audio_path in enumerate(audio_paths):
        logger.info("======== %d of %d in progress ========" % (i + 1, len(audio_paths)))
        # Load mp3
        feature, feature_per_second, song_length_second = audio_file_to_features(audio_path, config)
        logger.info("audio file loaded and feature computation success : %s" % audio_path)

        try: 
            # Majmin type chord recognition
            feature = feature.T
            feature = (feature - mean) / std
            time_unit = feature_per_second
            n_timestep = config.model['timestep']

            num_pad = n_timestep - (feature.shape[0] % n_timestep)
            feature = np.pad(feature, ((0, num_pad), (0, 0)), mode="constant", constant_values=0)
            num_instance = feature.shape[0] // n_timestep

            start_time = 0.0
            lines = []
            with torch.no_grad():
                model.eval()
                feature = torch.tensor(feature, dtype=torch.float32).unsqueeze(0).to(device)
                for t in range(num_instance):
                    self_attn_output, _ = model.self_attn_layers(feature[:, n_timestep * t:n_timestep * (t + 1), :])
                    prediction, _ = model.output_layer(self_attn_output)
                    prediction = prediction.squeeze()
                    for i in range(n_timestep):
                        if t == 0 and i == 0:
                            prev_chord = prediction[i].item()
                            continue
                        if prediction[i].item() != prev_chord:
                            lines.append(
                                '%.3f %.3f %s\n' % (start_time, time_unit * (n_timestep * t + i), idx_to_chord[prev_chord]))
                            start_time = time_unit * (n_timestep * t + i)
                            prev_chord = prediction[i].item()
                        if t == num_instance - 1 and i + num_pad == n_timestep:
                            if start_time != time_unit * (n_timestep * t + i):
                                lines.append('%.3f %.3f %s\n' % (start_time, time_unit * (n_timestep * t + i), idx_to_chord[prev_chord]))
                            break
        except Exception as e:
            logger.error("error in chord recognition : %s" % str(e))
            continue

        # lab file write
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        save_path = os.path.join(save_dir, os.path.split(audio_path)[-1].replace('.mp3', '').replace('.wav', '') + '.lab')
        with open(save_path, 'w') as f:
            for line in lines:
                f.write(line)

        logger.info("label file saved : %s" % save_path)
        print("label file saved : ", save_path)

        # lab file to midi file
        

        starts, ends, pitchs = list(), list(), list()

        intervals, chords = mir_eval.io.load_labeled_intervals(save_path)
        for p in range(12):
            for i, (interval, chord) in enumerate(zip(intervals, chords)):
                root_num, relative_bitmap, _ = mir_eval.chord.encode(chord)
                tmp_label = mir_eval.chord.rotate_bitmap_to_root(relative_bitmap, root_num)[p]
                if i == 0:
                    start_time = interval[0]
                    label = tmp_label
                    continue
                if tmp_label != label:
                    if label == 1.0:
                        starts.append(start_time), ends.append(interval[0]), pitchs.append(p + 48)
                    start_time = interval[0]
                    label = tmp_label
                if i == (len(intervals) - 1): 
                    if label == 1.0:
                        starts.append(start_time), ends.append(interval[1]), pitchs.append(p + 48)

        midi = pm.PrettyMIDI()
        instrument = pm.Instrument(program=0)

        for start, end, pitch in zip(starts, ends, pitchs):
            pm_note = pm.Note(velocity=120, pitch=pitch, start=start, end=end)
            instrument.notes.append(pm_note)

        midi.instruments.append(instrument)
        midi.write(save_path.replace('.lab', '.midi'))    

# # The following block should be at the very end of your test.py file
# if __name__ == "__main__":
#     parser = argparse.ArgumentParser()
#     parser.add_argument('--voca', default=True, type=lambda x: (str(x).lower() == 'true'))
#     parser.add_argument('--audio_dir', type=str, default='./test')
#     parser.add_argument('--save_dir', type=str, default='./test')
#     args = parser.parse_args()

#     # Call your function with arguments from the command-line
#     run_chord_model(audio_dir=args.audio_dir, save_dir=args.save_dir)