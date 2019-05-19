import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'
import { Speak } from './fart'
import { Blackout } from './blackout'
import { Utility } from './utility'

export class HUD {
    static readonly grayColor = new MRESDK.Color3(50.0 / 255.0, 50.0 / 255.0, 50.0 / 255.0)
    static readonly greenColor = new MRESDK.Color3(0.0 / 255.0, 100.0 / 255.0, 0.0 / 255.0)
    static readonly blueColor = new MRESDK.Color3(0.0 / 255.0, 100.0 / 255.0, 255.0 / 255.0)

    static readonly width = 1.0
    static readonly height = 1.0
    static readonly margin = 0.03
    static readonly padding = 0.02

    static readonly headerHeight = 0.06
    static readonly textHeight = 0.05

    private planeActor: MRESDK.Actor 
    private speak: Speak
    private blackout: Blackout

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.speak = new Speak(context, baseUrl)
        this.blackout = new Blackout(context)
    }

    public attachTo(user: User) {
        this.planeActor = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Plane,
                dimensions: { x: HUD.width, y: 0, z: HUD.height }
            },
            actor: {
                transform: { 
                    local: {
                        position: { x: 0, y: 0, z: 2 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -60 * MRESDK.DegreesToRadians)
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                },
                exclusiveToUser: user.id
            }
        }).value
    }

    public update(users: Array<User>) {
        for (let actor of this.planeActor.children) {
            actor.destroy()
        }

        this.addTextToHUD(this.planeActor, HUD.margin, HUD.margin, "User", HUD.grayColor, true)
        this.addTextToHUD(this.planeActor, HUD.margin + 0.4, HUD.margin, "Actions", HUD.grayColor, true)

        for (let index = 0; index < users.length; index = index + 1) {
            let user = users[index]

            let y = HUD.margin + (index + 1) * (HUD.textHeight + HUD.padding)

            this.addTextToHUD(this.planeActor, HUD.margin, y, Utility.truncate(user.name, 13), HUD.greenColor, false)

            let speakTextActor = this.addTextToHUD(this.planeActor, HUD.margin + 0.4, y, "Question", HUD.blueColor, false)
            speakTextActor.setCollider("box", false)
            
            const speakTextButtonBehavior = speakTextActor.setBehavior(MRESDK.ButtonBehavior)
            speakTextButtonBehavior.onClick('pressed', (mreUser: MRESDK.User) => {
                if (user.isSpeaking == false) {
                    this.speak.playSound(user)
                }
            })

            let blackoutTextActor = this.addTextToHUD(this.planeActor, HUD.margin + 0.6, y, "blackout", HUD.blueColor, false)
            blackoutTextActor.setCollider("box", false)
            
            const blackoutTextButtonBehavior = blackoutTextActor.setBehavior(MRESDK.ButtonBehavior)
            blackoutTextButtonBehavior.onClick('pressed', (mreUser: MRESDK.User) => {
                if (user.isBlackedOut == false) {
                    this.blackout.drawPlane(user)
                }
            })
        }
    }

    private addTextToHUD(hudPlane: MRESDK.Actor, x: number, y: number, contents: string, color: MRESDK.Color3, isHeader: boolean): MRESDK.Actor {
        var height: number = isHeader ? HUD.headerHeight : HUD.textHeight
        
        let textActor = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                parentId: hudPlane.id,
                transform: {
                    local: {
                        position: { 
                            x: -HUD.width / 2.0 + x, 
                            y: 0.01, 
                            z: HUD.height / 2.0 - y },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
                    }
                },
                text: {
                    contents: contents,
                    color: color,
                    height: height
                }
            }
        }).value

        return textActor
    }
}
