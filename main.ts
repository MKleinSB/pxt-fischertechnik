/**
 * Custom blocks for fischertechnik IO F5 
 * 
 * These blocks makes it easier to use Fischertechnik with 
 * the micro:bit IO F5 board from didacta 
 * http://www.didacta.hr/index.php?jezik=1
 * Feedback welcome!
 * 
 * MIT LICENSE Michael Klein 02.05.2019 https://twitter.com/kleinswelt
 * MIT LICENSE Originalcode for motorblocks by Philipp Henkel THANKS!
 * https://github.com/1010Technologies/pxt-makerbit-motor
 * Support the MakerBit: http://makerbit.com/
 * 
 */

const enum ftIN {
    //% block="I1 (P1)"
    I1 = AnalogPin.P1,
    //% block="I2 (P6)"
    I2 = AnalogPin.P6,
    //% block="I3 (P4)"
    I3 = AnalogPin.P4,
    //% block="I4 (P0)"
    I4 = AnalogPin.P0,
    //% block="I5 (P3)"
    I5 = AnalogPin.P3,
    //% block="I6 (P2)"
    I6 = AnalogPin.P2
}

const enum switchPins {
    //% block="I1 (P1)"
    I1 = AnalogPin.P1,
    //% block="I2 (P6)"
    I2 = AnalogPin.P6,
    //% block="I4 (P0)"
    I4 = AnalogPin.P0,
    //% block="I6 (P2)"
    I6 = AnalogPin.P2
}

const enum ftOUT {
    //% block="M1 (P16)"
    O1 = DigitalPin.P16,
    //% block="M1 (P15)"
    O2 = DigitalPin.P15,
    //% block="M2 (P14)"
    O3 = DigitalPin.P14,
    //% block="M2 (P13)"
    O4 = DigitalPin.P13,
    //% block="M3 (P12)"
    O5 = DigitalPin.P12,
    //% block="M3 (P10)"
    O6 = DigitalPin.P10,
    //% block="M4 (P9)"
    O7 = DigitalPin.P9,
    //% block="M4 (P8)"
    O8 = DigitalPin.P8
}

const enum pushType {
    //% block="pressed"
    down = PulseValue.High,
    //% block="released"
    up = PulseValue.Low
}
const enum FTMotor {
    //% block="M1"
    M1 = 0,
    //% block="M2"
    M2 = 1,
    //% block="M3"
    M3 = 2,
    //% block="M4"
    M4 = 3,
    //% block="ALL"
    ALL = 4
}

const enum MotorRotation {
    //% block="forward"
    Forward = 1,
    //% block="backward"
    Backward = -1
}

//% weight=100 color=#0641f9  icon="\uf085"
namespace fischertechnik {

    /**
    * Check if a specific pin is pressed
    * @param pin to be checked
    */
    //% blockId="PinIsPressed" block="switch %ftpin|pressed"
    // Gridpicker und 3 in eine Reihe
    //% ftpin.fieldEditor="gridpicker" ftpin.fieldOptions.columns=3
    // hohes Gewicht d.h. Block nach oben
    //% weight=95 blockGap=8
    // vorgegebener Pin I1
    //% ftpin.defl=ftIN.I1
    export function PinIsPressed(ftpin: ftIN): boolean {
        const pin = <DigitalPin><number>ftpin;
        return pins.digitalReadPin(pin) == 0;
    }

    /**
    * Check if a specific pin is released
    * @param pin to be checked
    */
    //% blockId="PinIsReleased" block="switch %ftpin|released"
    //% ftpin.fieldEditor="gridpicker" ftpin.fieldOptions.columns=3
    //% weight=94 blockGap=8
    export function PinIsReleased(ftpin: ftIN): boolean {
        const pin2 = <DigitalPin><number>ftpin;
        return pins.digitalReadPin(pin2) == 1;
    }

    /**
    * Writes a digital Pin to 0 or 1
    * @param pin to be checked
    * @param value high 1 or low 0 
    */
    //% blockId="ftdigitalWritePin" color="#FF0000" block="digital write pin %ftpin| to %wert"
    //% ftpin.fieldEditor="gridpicker" ftpin.fieldOptions.columns=3
    //% weight=93 blockGap=8
    //% value.min=0 value.max=1
    export function ftdigitalWritePin(ftpin: ftOUT, value: number) {
        const pin = <DigitalPin><number>ftpin;
        pins.digitalWritePin(pin, value)
        return;
    }


    /**
    * Do something when one of the pins is pressed.
    * @param pin to be checked
    */
    //% blockId="OnPinPressed" block="on switch %switchPins | pressed"
    //% ftpin.fieldEditor="gridpicker" ftpin.fieldOptions.columns=2
    //% weight=82 blockGap=8
    export function OnPinPressed(ftpin: switchPins, handler: Action) {
        const pin4 = <DigitalPin><number>ftpin;
        pins.onPulsed(pin4, <number>pushType.down, handler);
    }


    /**
    * Do something when one of the pins is released.
    * @param pin to be checked
    */
    //% blockId="OnPinReleased" block="on switch %ftIN | released"
    //% ftpin.fieldEditor="gridpicker" ftpin.fieldOptions.columns=3
    //% weight=81 blockGap=8
    export function OnPinReleased(ftpin: switchPins, handler: Action) {
        const pin5 = <DigitalPin><number>ftpin;
        pins.onPulsed(pin5, <number>pushType.up, handler);
    }

    /**
     * Write a comment in MakeCode
     */
    //% blockId="comment" block="comment %leerstring"
    export function comment(text: string): void {
    }

    // MakerBit motor driver blocks. Original Code from Pilipp Henkel
    // https://github.com/1010Technologies/pxt-makerbit-motor
    // MIT LICENSE

    const motorRotations = [MotorRotation.Forward, MotorRotation.Forward, MotorRotation.Forward, MotorRotation.Forward, MotorRotation.Forward];

    /**
     * Turns the selected motor on.
     * @param motor motor, eg: FTMotor.M1
     */
    //% subcategory=Motors
    //% blockId="runMotor" block="run motor %motor"
    //% motor.fieldEditor="gridpicker" motor.fieldOptions.columns=5
    //% weight=90
    export function runMotor(motor: FTMotor): void {
        //  if (speed === 0) {
        //      stopMotor(motor);
        //      return;
        //  }
        if (motor === FTMotor.M1 || motor === FTMotor.ALL) {
            const isClockwise = motorRotations[FTMotor.M1] > 0;
            pins.digitalWritePin(DigitalPin.P16, isClockwise ? 1 : 0);
            pins.digitalWritePin(DigitalPin.P15, isClockwise ? 0 : 1);
        }

        if (motor === FTMotor.M2 || motor === FTMotor.ALL) {
            const isClockwise = motorRotations[FTMotor.M2] > 0;
            pins.digitalWritePin(DigitalPin.P14, isClockwise ? 1 : 0);
            pins.digitalWritePin(DigitalPin.P13, isClockwise ? 0 : 1);
        }
        if (motor === FTMotor.M3 || motor === FTMotor.ALL) {
            const isClockwise = motorRotations[FTMotor.M3] > 0;
            pins.digitalWritePin(DigitalPin.P12, isClockwise ? 1 : 0);
            pins.digitalWritePin(DigitalPin.P10, isClockwise ? 0 : 1);
        }
        if (motor === FTMotor.M4 || motor === FTMotor.ALL) {
            const isClockwise = motorRotations[FTMotor.M4] > 0;
            pins.digitalWritePin(DigitalPin.P9, isClockwise ? 1 : 0);
            pins.digitalWritePin(DigitalPin.P8, isClockwise ? 0 : 1);
        }
    }

    /**
     * Stops a motor.
     * @param motor motor, eg: FTMotor.M1
     */
    //% subcategory=Motors
    //% motor.fieldEditor="gridpicker" motor.fieldOptions.columns=5
    //% blockId="stopMotor" block="stop motor %motor"
    //% weight=89
    export function stopMotor(motor: FTMotor): void {
        if (motor === FTMotor.M1 || motor === FTMotor.ALL) {
            pins.digitalWritePin(DigitalPin.P16, 0);
            pins.digitalWritePin(DigitalPin.P15, 0);
        }
        if (motor === FTMotor.M2 || motor === FTMotor.ALL) {
            pins.digitalWritePin(DigitalPin.P14, 0);
            pins.digitalWritePin(DigitalPin.P13, 0);
        }
        if (motor === FTMotor.M3 || motor === FTMotor.ALL) {
            pins.digitalWritePin(DigitalPin.P12, 0);
            pins.digitalWritePin(DigitalPin.P10, 0);
        }
        if (motor === FTMotor.M4 || motor === FTMotor.ALL) {
            pins.digitalWritePin(DigitalPin.P9, 0);
            pins.digitalWritePin(DigitalPin.P8, 0);
        }
    }

    /**
     * Sets the rotation direction of a motor. Use this function at start time to configure your motors without the need to rewire.
     * @param motor motor, eg: Motor.A
     * @param rotation rotation of the motor, eg: MotorDirection.Clockwise
     */
    //% subcategory=Motors
    //% motor.fieldEditor="gridpicker" motor.fieldOptions.columns=5
    //% rotation.fieldEditor="gridpicker" rotation.fieldOptions.columns=2
    //% blockId=setMotorRotation block="set motor %motor rotation | to %rotation"
    //% weight=88
    export function setMotorRotation(motor: FTMotor, rotation: MotorRotation) {
        if (motor === FTMotor.M1 || motor === FTMotor.ALL) {
            motorRotations[FTMotor.M1] = rotation;
        }
        if (motor === FTMotor.M2 || motor === FTMotor.ALL) {
            motorRotations[FTMotor.M2] = rotation;
        }
        if (motor === FTMotor.M3 || motor === FTMotor.ALL) {
            motorRotations[FTMotor.M3] = rotation;
        }
        if (motor === FTMotor.M4 || motor === FTMotor.ALL) {
            motorRotations[FTMotor.M4] = rotation;
        }
    }
}