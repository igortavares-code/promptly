import { Platform } from "react-native";
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";

export async function initAudioExpo(): Promise<boolean> {
  const { granted } = await requestRecordingPermissionsAsync();
  await setAudioModeAsync({
    playsInSilentMode: true,
    allowsRecording: true,
    interruptionModeAndroid: "doNotMix",
  });
  return granted;
}

export async function normalizeAudioUriExpo(uri: string): Promise<string> {
  if (Platform.OS === "web") {
    const resp = await fetch(uri);
    const blob = await resp.blob();
    return await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }
  return uri;
}