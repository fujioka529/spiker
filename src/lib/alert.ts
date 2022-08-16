//import useAlert from "~/composables/alert";
import risk3 from '../assets/audio/risk3.mp3'
import risk4 from '../assets/audio/risk4.mp3'
import risk5 from '../assets/audio/risk5.mp3'
import { CurrentMeasurement, Event } from '../types/response-types'

class AudioPlayer {
  audio: any | null = null
  event: Event

  constructor(event: Event) {
    this.event = event
    this.play()
  }

  public play() {
    let soundFile
    if (this.event.risk == 3) {
      soundFile = risk3
    } else if (this.event.risk == 4) {
      soundFile = risk4
    } else if (this.event.risk == 5) {
      soundFile = risk5
    }
    if (soundFile) {
      this.audio = new Audio(soundFile)
      this.audio.loop = true
      this.audio.play()
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause()
      this.audio = null
    }
  }
}

class AlertManager {
  audioPlayers: { [id: number]: AudioPlayer } = {}
  measurements: CurrentMeasurement[] = []

  public updateMeasurements(updates: CurrentMeasurement[]) {
    let willRemoves = this.measurements.filter(
      (x) => updates.findIndex((y) => y.id == x.id) == -1
    )
    // 削除対象の音は停止する。
    willRemoves.forEach((x) => {
      if (this.audioPlayers[x.id]) {
        this.audioPlayers[x.id].stop()
        delete this.audioPlayers[x.id]
      }
    })

    this.measurements = updates
    this.measurements.forEach((x) => {
      let player = this.audioPlayers[x.id]
      if (player) {
        if (
          x.latestEvent &&
          x.latestEvent.risk &&
          x.latestEvent.risk >= 3 &&
          !x.latestEvent.isClosed
        ) {
          if (x.latestEvent.risk != player.event.risk) {
            player.stop()
            this.audioPlayers[x.id] = new AudioPlayer(x.latestEvent)
          }
        } else {
          player.stop()
          delete this.audioPlayers[x.id]
        }
      } else {
        if (
          x.latestEvent &&
          x.latestEvent.risk &&
          x.latestEvent.risk >= 3 &&
          !x.latestEvent.isClosed
        ) {
          this.audioPlayers[x.id] = new AudioPlayer(x.latestEvent)
        }
      }
    })
  }
}

export const alertManager = new AlertManager()
