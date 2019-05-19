import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'

export class Speak {
    static readonly speakCloudResourceId = "artifact: 1209665568215400791"
    static readonly durationInMilliseconds = 7000 

    private interval: NodeJS.Timeout

    private speakSoundAsset: MRESDK.Sound

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.speakSoundAsset = this.context.assetManager.createSound(
            'speakSound',
            { uri: `${this.baseUrl}/fart.wav` }
        ).value    
    }

    public playSound(user: User) {
        user.isSpeaking = true

        user.speakSoundActor = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere
            },
            actor: {
                appearance: { 
                    enabled: false 
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                }
            }
        }).value

        user.speakSoundActor.startSound(this.speakSoundAsset.id, {
            volume: 1.0,
            looping: false,
            doppler: 0.0,
            spread: 0.0,
            rolloffStartDistance: 2.0
        },
        0.0)

        user.speakCloudActor = MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: Speak.speakCloudResourceId,
            actor: {
                transform: {
                    local: {
                        position: { x: 0, y: 0.05, z: -0.35 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -110 * MRESDK.DegreesToRadians),
                        scale: { x: 0.55, y: 0.55, z: 0.55 }
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                },
            }
        }).value

        this.interval = setTimeout(() => {
            user.isSpeaking = false
            user.speakSoundActor.destroy()
            user.speakCloudActor.destroy()
        }, Speak.durationInMilliseconds)
    }
}
