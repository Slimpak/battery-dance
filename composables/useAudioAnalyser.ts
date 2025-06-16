export function useAudioAnalyser({ fftSize = 64 }: { fftSize?: number } = {}) {
    const dataArray = new Uint8Array(fftSize)
  // stub: заполняем псевдослучайно, чтобы избежать ошибки "not defined"
    function getByteFrequencyData(arr: Uint8Array) {
        for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
        }
    }
    return { analyser: { getByteFrequencyData }, dataArray }
}