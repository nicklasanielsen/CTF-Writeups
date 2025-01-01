const sizes = {
    width: 1920,
    height: 1080
}

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");

    }

    preload() {
        this.load.image("bg", "./images/background_2.png");
        this.load.image("board", "./images/pcb_panel.png");
        this.load.image('pin', './images/pin.png');
        this.load.image('usb', "./images/uart-bridge.png");
        this.load.image('usb2', "./images/usb2.png");
        this.load.image('pda', "./images/pda.png")
        this.load.image('mpin', './images/m-pin.png');
        this.load.image('fpin', "./images/f-pin.png");
        this.load.image('vtoggle', "./images/vtoggler.png");
        this.load.image('particle', "./images/blueSmoke.png");
        this.load.image("left_arrow", "./images/left_arrow.png");
        this.load.image("right_arrow", "./images/right_arrow.png");
        this.load.image("down_arrow", "./images/down_arrow.png");
        this.load.image("up_arrow", "./images/up_arrow.png");
        this.load.image("left_arrow_p", "./images/left_arrow_p.png");
        this.load.image("right_arrow_p", "./images/right_arrow_p.png");
        this.load.image("down_arrow_p", "./images/down_arrow_p.png");
        this.load.image("up_arrow_p", "./images/up_arrow_p.png");
        this.load.image("start_button", "./images/start_button.png");
        this.load.image("start_button_p", "./images/start_button_p.png");
        this.load.image("power", "./images/power.png");
        this.load.image("power_p", "./images/power_p.png");
        this.load.image("3V", "./images/3V.png");
        this.load.image("5V", "./images/5V.png");
        this.load.image("red_led", "./images/red_led.png");
        this.load.image("green_led", "./images/green_led.png");
        this.load.image("uart_manual", "./images/uart_manual.png");
        this.load.image("terminal_button", "./images/terminal_button.png");

        this.load.audio('click_d', './audio/click2_d.wav');
        this.load.audio('click_u', './audio/click2_u.wav');
        this.load.audio('toggle', './audio/toggle.wav');
        this.load.audio('snap', './audio/snap.wav');
        this.load.audio('fizzing', './audio/sizzling.wav');
        this.load.audio('usb_connect', './audio/usb_connect.wav');
        this.load.audio('merp', './audio/merp.wav');
        this.load.audio('yippee', './audio/yippee.wav');
    }

    create() {

        this.dev = false;
        const self = this;
        this.add.image(0, 0, 'bg')
            .setOrigin(0, 0);

        // Add the click sound
        const clickD = this.sound.add('click_d');
        const clickU = this.sound.add('click_u');

        // Add toggle sound
        const toggle = this.sound.add('toggle');

        const snap = this.sound.add('snap');

        // Check the challenge status
        // this.checkChallengeStatus();

        // Create a button to trigger the zoom in
        const zoomInButton = this.add.text(1440, 95, '[Zoom In]', { font: '20px Arial', fill: '#ffffff' });
        zoomInButton.setInteractive();
        zoomInButton.setDepth(10); // Ensure the button is above other elements

        // Create a button to trigger the zoom out
        const zoomOutButton = this.add.text(1440, 95, '[Zoom Out]', { font: '20px Arial', fill: '#ffffff' });
        zoomOutButton.setInteractive();
        zoomOutButton.setDepth(10); // Ensure the button is above other elements
        zoomOutButton.setVisible(false); // Initially hidden

        // Attach event listeners to the buttons
        zoomInButton.on('pointerdown', () => zoomIn(this, zoomOutButton, zoomInButton));
        zoomOutButton.on('pointerdown', () => zoomOut(this, zoomOutButton, zoomInButton));


        // Create a button to open manual
        const manualButton = this.add.text(1740, 30, '[Open manual]', { font: '20px Arial', fill: '#ffffff' });
        manualButton.setInteractive();
        manualButton.setDepth(10); // Ensure the button is above other elements
        manualButton.on('pointerdown', () => showManual(this, manualButton));

        // Show manual on start
        showManual(this, manualButton);

        // Create board
        this.add.sprite(0, 0, 'board').setOrigin(0, 0);

        this.merp = this.sound.add('merp');
        this.yippee = this.sound.add('yippee');

        // Create USB cable
        const usbConnect = this.sound.add('usb_connect');
        const usb = this.add.image(0, 0, 'usb2').setOrigin(0, 0);
        usb.setInteractive(new Phaser.Geom.Rectangle(1597, 591, 200, 60), Phaser.Geom.Rectangle.Contains);
        // State variable to track the current position
        this.usbIsAtOriginalPosition = true;

        // Define the original, first, and final positions
        const usbOriginalPosition = { x: 0, y: 0 };
        const usbFirstPosition = { x: 250, y: 340 };
        const usbFinalPosition = { x: 170, y: 340 };

        // Function to move the image to a new position
        const moveUsb = (target, newPosition, duration, ease, onComplete) => {
            self.tweens.add({
                targets: target,
                x: newPosition.x,
                y: newPosition.y,
                duration: duration,
                ease: ease,
                onComplete: onComplete
            });
        };

        // On pointer down event (click)
        usb.on('pointerdown', function (pointer) {
            if (self.usbIsAtOriginalPosition) {
                // Move to the first position, then to the final position
                moveUsb(usb, usbFirstPosition, 1000, 'Power2', function () {
                    self.time.delayedCall(500, () => {
                        usbConnect.play();
                    });
                    moveUsb(usb, usbFinalPosition, 1000, 'Power2', function () {

                        self.usbIsAtOriginalPosition = false;
                    });
                });
            } else {
                // Move back to the original position
                usbConnect.play();
                moveUsb(usb, usbFirstPosition, 1000, 'Power2', function () {

                    moveUsb(usb, usbOriginalPosition, 1000, 'Power2', function () {
                        self.usbIsAtOriginalPosition = true;
                    });
                });
            }
        });


        // Create USB
        this.add.image(0, 0, 'usb').setOrigin(0, 0);

        // Create LED lights for UART
        this.greenLed = this.add.image(0, 0, 'green_led').setOrigin(0, 0);
        this.greenLed.setVisible(false);
        this.redLed = this.add.image(0, 0, 'red_led').setOrigin(0, 0);

        // Create PDA
        this.add.image(0, 0, 'pda').setOrigin(0, 0);

        // Create UART Voltage Switch
        const voltageT = this.add.image(0, 0, '5V').setOrigin(0, 0);

        // Create an invisible text object for the power-on animation
        const powerText = this.add.text(1220, 110, '', { fontSize: '32px', fill: '#fff' });
        const helpText = this.add.text(1220, 200, '', { fontSize: '15px', fill: '#fff' });

        // Hide help text initially
        helpText.setVisible(false);

        // Function to display the power-on animation
        function powerOnAnimation() {
            const message = "Powering on...";
            let currentIndex = 0;

            // Typewriter effect
            const typewriter = self.time.addEvent({
                delay: 150,
                callback: () => {
                    powerText.text += message[currentIndex];
                    currentIndex++;

                    // If the message is fully displayed, show the help screen
                    if (currentIndex === message.length) {
                        typewriter.remove(); // Stop the typewriter effect
                        self.time.delayedCall(1000, showHelpScreen); // Wait for 1 second and show help screen
                    }
                },
                repeat: message.length - 1
            });
            self.pdaPower = true;
        }

        // Function to display the help screen
        function showHelpScreen() {
            powerText.setVisible(false); // Hide power-on text
            const helpMessage = `
      S: Start serial connection
  Left/Right: Select value
  Up/Down: Select option
      `;
            helpText.setText(helpMessage.trim());
            helpText.setVisible(true);
        }

        // PDA Screen Text Stuff
        const baudRates = [300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200];
        const dataBits = [5, 6, 7, 8];
        const parityOptions = ["None", "odd", "even"];
        const stopBits = [1, 2];
        const flowControlOptions = ["None", "RTS/CTS", "Xon/Xoff", "RTS"];
        const ports = ["COM1", "COM2", "COM3", "USB0"];

        this.currentPortIndex = 0; // starting with COM1
        this.currentBaudIndex = 0; // starting with 300
        this.currentDataIndex = 0; // starting with 8 bit
        this.currentParityIndex = 0; // starting with None
        this.currentStopBitsIndex = 0; // starting with 1 bit
        this.currentFlowControlIndex = 0; // starting with None    

        let selectedOptionIndex = 0; // 0 for baud, 1 for data, 2 for parity, 3 for bits, 4 for stopbits, 5 for flow ctrl
        const options = ['port', 'baud', 'parity', 'bits', 'stopbits', 'flow ctrl'];

        let portText = this.add.text(1220, 110, '', { fontSize: '24px', fill: '#fff' });
        let baudRateText = this.add.text(1220, 140, '', { fontSize: '24px', fill: '#fff' });
        let parityText = this.add.text(1220, 170, '', { fontSize: '24px', fill: '#fff' });
        let dataBitsText = this.add.text(1220, 200, '', { fontSize: '24px', fill: '#fff' });
        let stopBitsText = this.add.text(1220, 230, '', { fontSize: '24px', fill: '#fff' });
        let flowControlText = this.add.text(1220, 260, '', { fontSize: '24px', fill: '#fff' });

        // updateText();

        // Create PDA Buttons
        const leftArrow = this.add.image(0, 0, 'left_arrow').setOrigin(0, 0);
        const rightArrow = this.add.image(0, 0, 'right_arrow').setOrigin(0, 0);
        const downArrow = this.add.image(0, 0, 'down_arrow').setOrigin(0, 0);
        const upArrow = this.add.image(0, 0, 'up_arrow').setOrigin(0, 0);
        const startButton = this.add.image(0, 0, 'start_button').setOrigin(0, 0);
        const power = this.add.image(0, 0, 'power').setOrigin(0, 0);

        this.pdaPower = false;

        function updateText() {
            if (self.pdaPower) {
                helpText.setVisible(false);
                showText();
                const defaultColor = '#fff';
                const selectedColor = '#2fe6c7'; // Selected color
                const poText = selectedOptionIndex === 0 ? `> Port: ${ports[self.currentPortIndex]}` : `Port: ${ports[self.currentPortIndex]}`;
                const bText = selectedOptionIndex === 1 ? `> Baud Rate: ${baudRates[self.currentBaudIndex]}` : `Baud Rate: ${baudRates[self.currentBaudIndex]}`;
                const pText = selectedOptionIndex === 2 ? `> Parity: ${parityOptions[self.currentParityIndex]}` : `Parity: ${parityOptions[self.currentParityIndex]}`;
                const dText = selectedOptionIndex === 3 ? `> Data: ${dataBits[self.currentDataIndex]} bit` : `Data: ${dataBits[self.currentDataIndex]} bit`;
                const sText = selectedOptionIndex === 4 ? `> Stop bits: ${stopBits[self.currentStopBitsIndex]} bit` : `Stop bits: ${stopBits[self.currentStopBitsIndex]} bit`;
                const fText = selectedOptionIndex === 5 ? `> Flow Ctrl: ${flowControlOptions[self.currentFlowControlIndex]}` : `Flow Ctrl: ${flowControlOptions[self.currentFlowControlIndex]}`;

                // Update text content and color based on the selected option index
                portText.setText(poText).setStyle({ fill: selectedOptionIndex === 0 ? selectedColor : defaultColor });
                baudRateText.setText(bText).setStyle({ fill: selectedOptionIndex === 1 ? selectedColor : defaultColor });
                parityText.setText(pText).setStyle({ fill: selectedOptionIndex === 2 ? selectedColor : defaultColor });
                dataBitsText.setText(dText).setStyle({ fill: selectedOptionIndex === 3 ? selectedColor : defaultColor });
                stopBitsText.setText(sText).setStyle({ fill: selectedOptionIndex === 4 ? selectedColor : defaultColor });
                flowControlText.setText(fText).setStyle({ fill: selectedOptionIndex === 5 ? selectedColor : defaultColor });
            }
        }
        function clearText() {
            portText.setVisible(false);
            baudRateText.setVisible(false);
            parityText.setVisible(false);
            dataBitsText.setVisible(false);
            stopBitsText.setVisible(false);
            flowControlText.setVisible(false);
        }

        function showText() {
            portText.setVisible(true);
            baudRateText.setVisible(true);
            parityText.setVisible(true);
            dataBitsText.setVisible(true);
            stopBitsText.setVisible(true);
            flowControlText.setVisible(true);
        }


        // Create PDA Buttons Pressed
        power.setInteractive(new Phaser.Geom.Rectangle(1617, 176, 70, 70), Phaser.Geom.Rectangle.Contains);
        power.on('pointerdown', () => {
            clickD.play()
            power.setTexture('power_p');
            if (!this.pdaPower) {
                clearText();
                powerOnAnimation();
                this.pdaPower = true;
            }
        });
        power.on('pointerup', function () {
            clickU.play()
            power.setTexture('power');
        });

        startButton.setInteractive(new Phaser.Geom.Rectangle(1380, 377, 70, 70), Phaser.Geom.Rectangle.Contains);
        startButton.on('pointerdown', () => {
            clickD.play()
            startButton.setTexture('start_button_p');
            if (self.pdaPower) {
                // let somethingtest = self.checkConditions()
                // console.log(somethingtest.value)
                this.togglePower()
            }
        });
        startButton.on('pointerup', function () {
            clickU.play()
            startButton.setTexture('start_button');
        });

        leftArrow.setInteractive(new Phaser.Geom.Rectangle(1546, 372, 50, 50), Phaser.Geom.Rectangle.Contains);
        leftArrow.on('pointerdown', function () {
            clickD.play()
            leftArrow.setTexture('left_arrow_p');
            switch (selectedOptionIndex) {
                case 0: self.currentPortIndex = (self.currentPortIndex - 1 + ports.length) % ports.length; break;
                case 1: self.currentBaudIndex = (self.currentBaudIndex - 1 + baudRates.length) % baudRates.length; break;
                case 2: self.currentParityIndex = (self.currentParityIndex - 1 + parityOptions.length) % parityOptions.length; break;
                case 3: self.currentDataIndex = (self.currentDataIndex - 1 + dataBits.length) % dataBits.length; break;
                case 4: self.currentStopBitsIndex = (self.currentStopBitsIndex - 1 + stopBits.length) % stopBits.length; break;
                case 5: self.currentFlowControlIndex = (self.currentFlowControlIndex - 1 + flowControlOptions.length) % flowControlOptions.length; break;
            }
            updateText();
        });
        leftArrow.on('pointerup', function () {
            clickU.play()
            leftArrow.setTexture('left_arrow');
        });

        rightArrow.setInteractive(new Phaser.Geom.Rectangle(1553, 422, 50, 50), Phaser.Geom.Rectangle.Contains);
        rightArrow.on('pointerdown', function () {
            clickD.play()
            rightArrow.setTexture('right_arrow_p');
            switch (selectedOptionIndex) {
                case 0: self.currentPortIndex = (self.currentPortIndex + 1) % ports.length; break;
                case 1: self.currentBaudIndex = (self.currentBaudIndex + 1) % baudRates.length; break;
                case 2: self.currentParityIndex = (self.currentParityIndex + 1) % parityOptions.length; break;
                case 3: self.currentDataIndex = (self.currentDataIndex + 1) % dataBits.length; break;
                case 4: self.currentStopBitsIndex = (self.currentStopBitsIndex + 1) % stopBits.length; break;
                case 5: self.currentFlowControlIndex = (self.currentFlowControlIndex + 1) % flowControlOptions.length; break;
            }
            updateText();
        });
        rightArrow.on('pointerup', function () {
            clickU.play()
            rightArrow.setTexture('right_arrow');
        });

        upArrow.setInteractive(new Phaser.Geom.Rectangle(1484, 372, 50, 50), Phaser.Geom.Rectangle.Contains);
        upArrow.on('pointerdown', function () {
            clickD.play()
            upArrow.setTexture('up_arrow_p');
            selectedOptionIndex = (selectedOptionIndex - 1 + options.length) % options.length;
            updateText();
        });
        upArrow.on('pointerup', function () {
            clickU.play()
            upArrow.setTexture('up_arrow');
        });

        downArrow.setInteractive(new Phaser.Geom.Rectangle(1492, 423, 50, 50), Phaser.Geom.Rectangle.Contains);
        downArrow.on('pointerdown', function () {
            clickD.play()
            downArrow.setTexture('down_arrow_p');
            selectedOptionIndex = (selectedOptionIndex + 1) % options.length;
            updateText();
        });
        downArrow.on('pointerup', function () {
            clickU.play()
            downArrow.setTexture('down_arrow');
        });

        this.uV = 5

        voltageT.setInteractive(new Phaser.Geom.Rectangle(1672, 884, 50, 20), Phaser.Geom.Rectangle.Contains);
        voltageT.on('pointerdown', () => {
            toggle.play()
            // Toggle texture based on the current state
            if (self.uV === 3) {
                voltageT.setTexture('5V');
                self.uV = 5
            } else {
                voltageT.setTexture('3V');
                self.uV = 3
            }
        });

        // On pointer over event to set the tint to yellow
        voltageT.on('pointerover', () => {
            voltageT.setTint(0xffff00); // Set tint to yellow
        });

        // On pointer out event to clear the tint
        voltageT.on('pointerout', () => {
            voltageT.clearTint(); // Clear tint
        });


        // Initial state
        this.powerOn = false;
        this.allConnectedUp = false;


        this.smokey = this.sound.add('fizzing');
        const smoked = this.add.particles(318, 332, "particle", {
            speed: 50,
            angle: { min: 0, max: 360 },  // Emit in all directions
            frequency: 20, // Frequency of emission
            quantity: 10,    // Number of particles per emission
            scale: { start: .2, end: 0 },
            tint: 0xFFFFFF,
            blendMode: "EASE",
            gravityY: -200,
            alpha: { start: 0.3, end: 0 }, // Particles fade out
            lifespan: 2000,
            rotate: { start: 0, end: 360 }, // Rotation of particles over their lifespan      
        });

        // Optionally, start the smoked (it starts by default)
        smoked.stop();
        smoked.name = "smoked";

        // Helper function to set up pointer events
        function addHoverTint(sprite) {
            sprite.setInteractive();

            sprite.on('pointerover', function () {
                this.setTint(0xffff00); // Change to the desired tint color (yellow)
            });

            sprite.on('pointerout', function () {
                this.clearTint();
            });
        }

        // Helper function to set up pointer events
        function addHoverFill(sprite) {
            sprite.setInteractive();

            sprite.on('pointerover', function () {
                this.setFillStyle(0xffff00, 0.5); // Change to the desired tint color (yellow)
            });

            sprite.on('pointerout', function () {
                this.setFillStyle(0xffff00, 0);
            });
        }

        // Create pins
        const pads = [
            { source: { name: 'gnd', loc: { x: 580, y: 430 } }, dest: { name: 'uGnd', loc: { x: 1392, y: 986 } } },
            { source: { name: 'tx', loc: { x: 580, y: 382 } }, dest: { name: 'uRx', loc: { x: 1392, y: 962 } } },
            { source: { name: 'rx', loc: { x: 580, y: 405 } }, dest: { name: 'uTx', loc: { x: 1392, y: 936 } } },
            { source: { name: 'v3', loc: { x: 580, y: 358 } }, dest: { name: 'uVcc', loc: { x: 1392, y: 913 } } }
        ]

        const spads = []
        const dpins = []
        // Iterate over each pad
        pads.forEach(pad => {
            // Create an interactive rectangle for the current pad's source location
            const spad = this.add.rectangle(pad.source.loc.x, pad.source.loc.y, 55, 12, 0xffffff, 0).setOrigin(0, .5);
            spad.name = pad.source.name;
            addHoverFill(spad);

            // Create an interactive rectangle for the current pad's destination location
            const dpin = this.add.rectangle(pad.dest.loc.x, pad.dest.loc.y, 55, 12, 0xffffff, 0).setOrigin(0, .5);
            dpin.name = pad.dest.name;
            addHoverFill(dpin);

            spads.push(spad);
            dpins.push(dpin);
        });

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            if (gameObject.name == "t2") {
                j1.x = dragX;
                j1.y = dragY;
            }
            // console.log(gameObject.name)
        }

        );

        // Create jumper wires
        const j1f = this.add.sprite(800, 930, 'fpin').setScale(0.9).setName('j1f');
        const j1m = this.add.sprite(100, 930, 'fpin').setScale(0.9).setName('j1m').setRotation(3.14);
        const j2f = this.add.sprite(800, 950, 'fpin').setScale(0.9).setName('j2f');
        const j2m = this.add.sprite(100, 950, 'fpin').setScale(0.9).setName('j2m').setRotation(3.14);
        const j3f = this.add.sprite(800, 970, 'fpin').setScale(0.9).setName('j3f');
        const j3m = this.add.sprite(100, 970, 'fpin').setScale(0.9).setName('j3m').setRotation(3.14);
        const j4f = this.add.sprite(800, 990, 'fpin').setScale(0.9).setName('j4f');
        const j4m = this.add.sprite(100, 990, 'fpin').setScale(0.9).setName('j4m').setRotation(3.14);

        // Apply hover tint to all sprites
        [j1f, j1m, j2f, j2m, j3f, j3m, j4f, j4m].forEach(addHoverTint);

        // Define the sprite pairs
        const spritePairs = [
            { sprite1: j1m, sprite2: j1f, color: 0xfcba03 },
            { sprite1: j2m, sprite2: j2f, color: 0x2cfc03 },
            { sprite1: j3m, sprite2: j3f, color: 0x000000 },
            { sprite1: j4m, sprite2: j4f, color: 0xff0000 },
        ];

        // Create wire graphics for each pair
        spritePairs.map(pair => {
            const wireGraphics = this.add.graphics();
            pair.wireGraphics = wireGraphics;
            pair.initialWire = self.drawWire(wireGraphics, pair.sprite1, pair.sprite2, pair.color);
            return wireGraphics;
        });

        // Make each sprite draggable and update wire position while dragging
        spritePairs.forEach(pair => {
            [pair.sprite1, pair.sprite2].forEach(sprite => {
                sprite.setInteractive({ draggable: true });
                self.input.setDraggable(sprite);

                sprite.on('drag', () => {
                    pair.wireGraphics.clear(); // Clear previous wire
                    self.drawWire(pair.wireGraphics, pair.sprite1, pair.sprite2, pair.color); // Draw updated wire
                });

                // Check pin connections and snap into place when dragging stops
                sprite.on('dragend', () => {
                    const snapDistance = 20; // Distance threshold for snapping

                    // Check for intersection and snap into place
                    spritePairs.forEach(pair => {
                        pads.forEach(pad => {
                            const femaleSprite = self.children.getByName(pair.sprite2.name);
                            const maleSprite = self.children.getByName(pair.sprite1.name);

                            if (Phaser.Geom.Intersects.RectangleToRectangle(femaleSprite.getBounds(), self.children.getByName(pad.dest.name).getBounds())) {
                                if (Phaser.Math.Distance.Between(femaleSprite.x, femaleSprite.y, self.children.getByName(pad.dest.name).x, self.children.getByName(pad.dest.name).y) < snapDistance) {
                                    femaleSprite.x = self.children.getByName(pad.dest.name).x + 8;
                                    femaleSprite.y = self.children.getByName(pad.dest.name).y;
                                    pair.wireGraphics.clear(); // Clear previous wire
                                    self.drawWire(pair.wireGraphics, pair.sprite1, pair.sprite2, pair.color); // Draw updated wire
                                    snap.play();
                                }
                            }

                            if (Phaser.Geom.Intersects.RectangleToRectangle(maleSprite.getBounds(), self.children.getByName(pad.source.name).getBounds())) {
                                if (Phaser.Math.Distance.Between(maleSprite.x, maleSprite.y, self.children.getByName(pad.source.name).x + 60, self.children.getByName(pad.source.name).y) < snapDistance) {
                                    maleSprite.x = self.children.getByName(pad.source.name).x + 50;
                                    maleSprite.y = self.children.getByName(pad.source.name).y;
                                    pair.wireGraphics.clear(); // Clear previous wire
                                    self.drawWire(pair.wireGraphics, pair.sprite1, pair.sprite2, pair.color); // Draw updated wire
                                    snap.play();
                                }
                            }
                        });
                    });

                    this.connectPins();
                });
            });
        });

        if (this.dev) {
            var mouseCoordinates = this.add.text(10, 10, 'X: 0 Y: 0', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' });
            this.input.on('pointermove', function (pointer) {
                mouseCoordinates.setText('X: ' + pointer.x.toFixed(2) + ' Y: ' + pointer.y.toFixed(2));
            });


        }
        this.checkPlayerToken();

    }

    update() {
        if (!this.usbIsAtOriginalPosition) {
            this.redLed.setVisible(true);
        } else {
            this.redLed.setVisible(false);
        }
    }
    // Method to check the conditions
    async checkConditions() {

        if (this.uV === 3 && this.allConnectedUp && !this.usbIsAtOriginalPosition || this.dev) {
            // console.log("PARTY TIME");
            let checkIt = await checkit([this.currentPortIndex, this.currentBaudIndex, this.currentParityIndex, this.currentDataIndex, this.currentStopBitsIndex, this.currentFlowControlIndex], this.uV)
            if (checkIt) {
                this.popup("success! loading bootloader...\nGo speak with Jewel Loggins for the next step!");
                this.yippee.play();
            } else {
                this.merp.play();
                this.popup("Serial connection couldn't be established...\nPlease check your settings and try again.");
            }

            // window.open('https://www.anotherexample.com', '_blank'); // Replace with your desired URL
            return true;
        } else {
            if (this.uV === 5 && this.allConnectedUp && !this.usbIsAtOriginalPosition) {
                const smoked = this.children.getByName('smoked');
                smoked.start();
                this.playAudioForDuration(this.smokey, 3000);
                this.time.delayedCall(3000, () => smoked.stop(), [], this);
            }
            // Power on fail phrases
            const tryagainphrases = [
                "Level incomplete! Keep playing!",
                "Insert coin to continue your quest!",
                "Continue? Time's running out!",
                "You haven't beaten the high score yet!",
                "Mission not accomplished! Retry?",
                "Game over? Not yet, give it another shot!",
                "The Force is not yet strong with this one.",
                "You haven't completed your Jedi training.",
                "Mission incomplete. The Rebellion still needs you.",
                "The Death Star plans are still out of reach.",
                "Your journey to the Dark Side is not over.",
                "The Force is calling, but you haven't answered.",
                "The Matrix still holds you, Neo.",
                "You haven't broken free of the simulation yet.",
                "Red pill taken, but the truth is not revealed.",
                "The code is still incomplete. Keep hacking.",
                "The Architect awaits your next move.",
                "Reality is still an illusion. Persist.",
                "Objective not complete. The city still needs you.",
                "Neural link still active. Dive deeper.",
                "Hack incomplete. Keep infiltrating.",
                "You're still a ghost in the machine.",
                "Cyber mission not finished. Keep running.",
                "The grid still controls you. Break free.",
                "Mission to Mars not yet completed.",
                "Stardate update: Task unfinished.",
                "You haven't reached the final frontier.",
                "The galaxy awaits your return.",
                "Your voyage is incomplete. Keep exploring.",
                "Space mission still ongoing. Continue the adventure.",
                "Mission not complete, soldier. Keep fighting!",
                "You haven't saved the day yet.",
                "The hero's journey is unfinished.",
                "The battle is still raging. Don't give up.",
                "You haven't defeated the villain yet.",
                "Keep going, the action isn't over."
            ];
            const tryagain = tryagainphrases[Math.floor(Math.random() * tryagainphrases.length)]
            console.log(`The Machine: "${tryagain}"`);

            // const voltage = vtoggle ? vtoggle.vol : "vtoggle not found";
            console.log(`Voltage: ${this.uV}, Wires Connected: ${this.allConnectedUp}, Power: False`);
            return false;
        }
    }

    popup(inputtext) {
        // Create a container to hold the rectangle and its contents
        const container = this.add.container(0, 0);

        // Define rectangle dimensions and position
        const rectWidth = 1000;
        const rectHeight = 400;
        const rectX = (this.cameras.main.width - rectWidth) / 2;
        const rectY = (this.cameras.main.height - rectHeight) / 2;

        // Create a graphics object for the rectangle
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(rectX, rectY, rectWidth, rectHeight);

        // Add the graphics to the container
        container.add(graphics);

        // Add text inside the rectangle
        const text = this.add.text(rectX + 10, rectY + 10, inputtext, { fontSize: '20px', fill: '#fff' });
        container.add(text);

        // Create the "X" button in the top right corner of the rectangle
        const closeButton = this.add.text(rectX + rectWidth - 20, rectY + 5, 'X', { fontSize: '20px', fill: '#fff' });
        closeButton.setInteractive();
        container.add(closeButton);

        // Make the "X" button interactive
        closeButton.on('pointerdown', () => {
            container.destroy();
        });

        // Bring the container to the top
        this.children.bringToTop(container);
    }

    checkPlayerToken() {
        const HHC_RESOURCE_ID = getResourceID();

        // Check if the HHC_RESOURCE_ID cookie already exists
        // const existingToken = getCookie('HHC_RESOURCE_ID');

        if (!HHC_RESOURCE_ID) {
            console.error("No player token found in the URL query parameters. Please make sure you have the correct URL.");
            this.popup("No player token found in the URL query parameters or cookie jar.\nPlease make sure you have the correct URL.");
        }
    }

    // Method to toggle the power state
    togglePower() {
        if (this.checkConditions()) {
            this.powerOn = !this.powerOn;
            // this.greenLed.setVisible(true);
        }
    }

    // Method to draw the button with rounded corners and shadow
    drawButton(x, y, width, height, radius, color) {
        this.buttonGraphics.clear();

        // Draw drop shadow
        this.buttonGraphics.fillStyle(0x000000, 0.5);
        this.buttonGraphics.fillRoundedRect(x + 5, y + 5, width, height, radius);

        // Draw button
        this.buttonGraphics.fillStyle(color, 1);
        this.buttonGraphics.fillRoundedRect(x, y, width, height, radius);
    }

    // Function to play audio for a specified duration and fade out
    playAudioForDuration = (audio, duration) => {
        audio.play();

        // Create a tween to fade out the volume over the specified duration
        this.tweens.add({
            targets: audio,
            volume: 0,
            duration: duration,
            onComplete: () => {
                audio.stop(); // Stop the audio after fading out
                audio.setVolume(1); // Reset the volume for the next play
            }
        });
    };

    // Checks for proper pin connections
    connectPins() {
        let allPinnedUp = 0;

        const targetPins = [
            { pin: this.children.getByName('gnd'), dest: this.children.getByName('uGnd'), color: 0x000000 },
            { pin: this.children.getByName('tx'), dest: this.children.getByName('uRx'), color: 0x1bff00 },
            { pin: this.children.getByName('rx'), dest: this.children.getByName('uTx'), color: 0xff8700 },
            { pin: this.children.getByName('v3'), dest: this.children.getByName('uVcc'), color: 0xff0000 }
        ];

        const jumperWires = [
            { female: this.children.getByName('j1f'), male: this.children.getByName('j1m') },
            { female: this.children.getByName('j2f'), male: this.children.getByName('j2m') },
            { female: this.children.getByName('j3f'), male: this.children.getByName('j3m') },
            { female: this.children.getByName('j4f'), male: this.children.getByName('j4m') }
        ];

        targetPins.forEach((targetPin) => {
            let connectionFound = false;

            jumperWires.forEach((wire) => {
                if (
                    wire.female &&
                    Phaser.Geom.Intersects.RectangleToRectangle(wire.female.getBounds(), targetPin.dest.getBounds()) &&
                    wire.male &&
                    Phaser.Geom.Intersects.RectangleToRectangle(wire.male.getBounds(), targetPin.pin.getBounds())
                ) {
                    console.log(`Connected ${targetPin.pin.name} (${targetPin.dest.name}) with ${wire.female.name} and ${wire.male.name}`);
                    allPinnedUp++;
                    connectionFound = true;
                    // You can add more logic here for when the connection is made
                }
            });

            if (!connectionFound) {
                console.warn(`No connection found for ${targetPin.pin.name} (${targetPin.dest.name})`);
            }
        });

        if (allPinnedUp === targetPins.length) {
            console.log("All pinned up!");
            this.allConnectedUp = true;
        } else {
            this.allConnectedUp = false;
        }
    }

    // Function to draw a wire with a random Bezier curve between two sprites
    drawWire(graphics, sprite1, sprite2, color) {
        const startPoint = {
            x: sprite1.x + 42, // Adjust for sprite pivot
            y: sprite1.y
        };
        const endPoint = {
            x: sprite2.x - 42, // Adjust for sprite pivot
            y: sprite2.y
        };

        // Calculate random control points
        const controlX1 = Phaser.Math.Between(startPoint.x, endPoint.x);
        const controlY1 = Phaser.Math.Between(startPoint.y, endPoint.y);
        const controlX2 = Phaser.Math.Between(startPoint.x, endPoint.x);
        const controlY2 = Phaser.Math.Between(startPoint.y, endPoint.y);

        // Create a cubic Bezier curve
        const curve = new Phaser.Curves.CubicBezier(
            new Phaser.Math.Vector2(startPoint.x, startPoint.y),
            new Phaser.Math.Vector2(controlX1, controlY1),
            new Phaser.Math.Vector2(controlX2, controlY2),
            new Phaser.Math.Vector2(endPoint.x, endPoint.y)
        );

        // Draw the curve
        graphics.lineStyle(7, color);
        curve.draw(graphics);

        return graphics;
    }

    checkChallengeStatus() {
        // Retrieve the request ID from the URL query parameters
        // var requestID = getCookie('HHC_RESOURCE_ID');
        const requestID = getResourceID(); // Replace 'paramName' with the actual parameter name you want to retrieve


        if (!requestID) {
            requestID = "00000000-0000-0000-0000-000000000000";
        }

        fetch(`/api/v2/check-challenge?requestID=${requestID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requestID: requestID })
        })
            .then(response => response.text())
            .then(text => {
                if (text === 'true') {
                    this.displayButton();
                }
            })
            .catch(error => console.error('Error checking challenge status:', error));
    }

    displayButton() {
        const button = this.add.image(1800, 150, 'terminal_button').setOrigin(0.5, 0.5).setInteractive();
        button.scale = 0.5;

        button.on('pointerdown', () => {
            console.log('Button clicked!');
            // Add your button click handler logic here
        });
    }


}

async function checkit(serial, uV) {
    // Retrieve the request ID from the URL query parameters
    const requestID = getResourceID(); // Replace 'paramName' with the actual parameter name you want to retrieve

    if (!requestID) {
        requestID = "00000000-0000-0000-0000-000000000000";
    }

    // Build the URL with the request ID as a query parameter
    // Word on the wire is that some resourceful elves managed to brute-force their way in through the v1 API.
    // We have since updated the API to v2 and v1 "should" be removed by now.
    // const url = new URL(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v1/complete`);
    const url = new URL(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v2/complete`);

    try {
        // Make the request to the server
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requestID: requestID, serial: serial, voltage: uV })
        });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log("Data", data)
        // Return true if the response is true
        return data === true;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return false;
    }
}

async function dad() {

    // Build the URL with the request ID as a query parameter
    const url = new URL(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/joke`);

    try {
        // Make the request to the server
        const response = await fetch(url, {
            method: 'GET'
        });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log(data)
        // Return true if the response is true
        return data === true;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return false;
    }
}

function showManual(scene, manualButton) {
    // Create a semi-transparent overlay

    // Hide the manual button
    manualButton.setVisible(false);

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7); // Black color with 70% opacity
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(9); // Ensure the overlay is behind the popup

    // Add the center image to the canvas
    const centerImage = scene.add.image(scene.cameras.main.centerX, scene.cameras.main.centerY, 'uart_manual');
    centerImage.setOrigin(0.5, 0.5); // Center the image
    centerImage.setDepth(10); // Set a high depth value to ensure it appears above other elements

    // Add the 'X' button as text
    const closeButton = scene.add.text(1569, 130, 'X', { font: '34px Arial', fill: '#ffffff' });
    closeButton.setOrigin(0.5, 0.5); // Position the text in the top-right corner
    closeButton.setDepth(11); // Set a higher depth value than the image

    // Make the 'X' button interactive
    closeButton.setInteractive();

    // Add an event listener to the 'X' button to close the image
    closeButton.on('pointerdown', () => {
        // Create a more playful exit animation
        scene.tweens.add({
            targets: [centerImage, closeButton],
            scale: { from: 1, to: 0 }, // Shrink to nothing
            angle: { from: 0, to: 360 }, // Full rotation
            x: '+=200', // Move to the right
            y: '+=200', // Move down
            alpha: { from: 1, to: 0 }, // Fade out to transparent
            duration: 1000, // Duration of the tween in milliseconds
            ease: 'Cubic.easeIn', // Easing function for smooth animation
            onComplete: () => {
                // Remove the popup elements
                centerImage.destroy();
                closeButton.destroy();
                overlay.destroy();
                manualButton.setVisible(true); // Show the manual button again
            }
        });
    });

    closeButton.on('pointerover', () => {
        closeButton.setTint(0xffff00); // Change text color to yellow on hover
    });
    closeButton.on('pointerout', () => {
        closeButton.clearTint(); // Clear the text color
    });
}

function zoomIn(scene, zoomOutButton, zoomInButton) {
    // Define the target area to zoom into
    const targetX = 900; // X coordinate to focus on
    const targetY = 10; // Y coordinate to focus on
    const zoomLevel = 2; // Desired zoom level

    // Tween the camera to zoom in and move to the target area
    scene.tweens.add({
        targets: scene.cameras.main,
        zoom: zoomLevel,
        scrollX: targetX - (scene.cameras.main.width / 2) / zoomLevel,
        scrollY: targetY - (scene.cameras.main.height / 2) / zoomLevel,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
            // Show the zoom out button
            zoomOutButton.setVisible(true);
            zoomInButton.setVisible(false);
        }
    });
}

function zoomOut(scene, zoomOutButton, zoomInButton) {
    // Tween the camera to zoom out and reset to the original position
    scene.tweens.add({
        targets: scene.cameras.main,
        zoom: 1, // Reset zoom level
        scrollX: 0, // Reset scrollX
        scrollY: 0, // Reset scrollY
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
            // Hide the zoom out button
            zoomOutButton.setVisible(false);
            zoomInButton.setVisible(true);
        }
    });
}




function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const config = {
    parent: 'phaser',
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    scene: [GameScene],
    backgroundColor: '#FFFF00',
    canvas: gameCanvas,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// Function to get cookie value by name
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Check if this cookie is the one we're looking for
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null; // Cookie not found
}

function getResourceID() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const urlParams = new URLSearchParams(url.search);
    const HHC_RESOURCE_ID = urlParams.get('id'); // Replace 'paramName' with the actual parameter name you want to retrieve

    if (HHC_RESOURCE_ID) {
        return HHC_RESOURCE_ID;
    } else {
        return "00000000-0000-0000-0000-000000000000";
    }
}