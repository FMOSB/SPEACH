import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

export class User {
    public isSpeaking: boolean
    public speakSoundActor: MRESDK.Actor
    public speakCloudActor: MRESDK.Actor

    public isBlackedOut: boolean
    public blackoutOutwardFacingSphereActor: MRESDK.Actor
    public blackoutInwardFacingSphereActor: MRESDK.Actor

    constructor(public id: string, public name: string) {
        this.isSpeaking = false
        this.speakSoundActor = null
        this.speakCloudActor = null

        this.isBlackedOut = false
        this.blackoutOutwardFacingSphereActor = null
        this.blackoutInwardFacingSphereActor = null
    }
}   
