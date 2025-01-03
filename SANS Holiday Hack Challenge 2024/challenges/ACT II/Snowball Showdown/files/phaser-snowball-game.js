class SnowBallGame extends Phaser.Scene {
    constructor() {
        super({ key: "game" });
        this.hasBgDebug = typeof window.bgDebug !== 'undefined'
        this.groundOffset = groundOffset;
        this.yellowTint = 0xffeb99;
        this.blueTint = 0x99ddff;
        this.snowballLiveTime = 12000;
        this.healingTerrain = true;
        this.terrainHealDelay = 15000;
        this.elfGroundOffset = GAME_HEIGHT - 115;
        this.wombleyXLocation = GAME_WIDTH - 40;
        this.alabasterXLocation = 40;
        this.playerMoveSpeed = 150;
        this.lastTimePlayerArrowsFromUpdate = 0
        this.lastTimePlayerArrowsFromUpdateDelay = 20
        this.percentageShotPower = 0;
        this.alabasterElvesThrowDelayMin = 1500;
        this.alabasterElvesThrowDelayMax = 2500;
        this.wombleyElvesThrowDelayMin = 1500;
        this.wombleyElvesThrowDelayMax = 2500;
        this.wombleyElvesIncompacitateTime = 5000;
        this.alabasterElvesIncompacitateTime = 5000;
        this.playerIncompacitateTime = 5000;
        this.throwSpeed = 1000;
        this.throwRateOfFire = 1000;
        this.lastThrowTime = 0;
        this.mouseIsOverCanvas = false;
        this.lastPointerPosition = { x: 0, y: 0 };
        this.tempMatrix = new Phaser.GameObjects.Components.TransformMatrix();
        this.tempParentMatrix = new Phaser.GameObjects.Components.TransformMatrix();
        this.lastProjectileCollisionDetectionTime = 0;
        this.projectileCollisionDetectionRate = 25;
        this.isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
        this.ws = null;
        this.hand_offsets = {
            lx: 20,
            ly: 40,
            rx: 60,
            ry: 10,
        }
        this.snowball_offset = {
            x: this.hand_offsets.rx - 15,
            y: this.hand_offsets.ry - 135
        }
    }
    preload() {
        this.load.image('ground', 'imgs/bg/l6-ground.png');
        this.load.image('skybackground', 'imgs/bg/l1-background.png');
        this.load.image('mountains', 'imgs/bg/l2-mountains01.png');
        this.load.image('clouds', 'imgs/bg/l3-clouds.png');
        this.load.image('forest', 'imgs/bg/l4-forest.png');
        this.load.image('houses', 'imgs/bg/l5-houses.png');
        this.load.image('houses-alt', 'imgs/bg/l5-houses-alt.png');
        //this.load.image('castle', 'imgs/bg/castle_bg.png');
        this.load.image('ice_wall', 'imgs/bg/walltall2.png');
        this.load.image('ice_arch', 'imgs/bg/ice_arch.png');
        this.load.image('ice_platform', 'imgs/bg/ice_platform.png');
        this.load.image('banner_alabaster', 'imgs/banner_alabaster.png');
        this.load.image('banner_wombley', 'imgs/banner_wombley.png');
        this.load.image('alabastersnowball', 'imgs/alabastersnowball.png');
        this.load.image('wombleycube', 'imgs/wombleycube.png');
        this.load.image('hand', 'imgs/hand.png');
        this.load.image('snowball', 'imgs/snowball.png');
        this.load.image('arrow', 'imgs/arrow_small.png');
        this.load.image('particle', "imgs/particle.png");
        this.load.image('particle_yellow', "imgs/particle_yellow.png");
        this.load.image('chat_bubble', "imgs/bubble.png");
        this.load.image('bomber1', "imgs/bomber1.png");
        this.load.image('bomber2', "imgs/bomber2.png");
        this.load.image('bomber_nub', "imgs/bomber_nub.png");
        this.load.image('dwarf-min', "imgs/MOASB-min-dwarf.png");
        this.load.image('scrollintro', 'imgs/intro_scroll.png')
        this.load.image('scroll', 'imgs/scroll.png')
        this.load.image('panel', 'imgs/panel.png')
        this.load.image('table', 'imgs/table.png')
        this.load.image('alab_base_smile', 'imgs/alab_base_smile.png')
        this.load.image('alab_base_sad', 'imgs/alab_base_sad.png')
        //this.load.image('castle_min', 'imgs/bg/castle_min.png')
        this.load.image('castle_base', 'imgs/bg/castle_base.png')
        this.load.spritesheet('propeller', 'imgs/propeller_sprite_sheet_half.png', {
            frameWidth: 150,
            frameHeight: 150
        });
        //this.load.image('dot', "imgs/dot.png");
        this.load.spritesheet('hand_sh', 'imgs/hand_sh.png', {
            frameWidth: 288,
            frameHeight: 288
        });
        let avatar1 = SampleAvatars[Math.floor(Math.random() * SampleAvatars.length)];
        let avatar2 = SampleAvatars[Math.floor(Math.random() * SampleAvatars.length)];
        while (avatar1 === avatar2) {
            avatar2 = SampleAvatars[Math.floor(Math.random() * SampleAvatars.length)];
        }
        this.load.image('avatar1', avatar1);
        this.load.image('avatar2', avatar2);
        let numOfElvesOnPlayersSide = 10;
        this.playerElfIds = [];
        for (let i = 0; i < numOfElvesOnPlayersSide; i++) {
            let elfId = elfIds[Math.floor(Math.random() * elfIds.length)];
            while (this.playerElfIds.includes(elfId)) {
                elfId = elfIds[Math.floor(Math.random() * elfIds.length)];
            }
            // elfNames
            let elfName = elfNames[Math.floor(Math.random() * elfNames.length)];
            while (this.playerElfIds.includes(elfName)) {
                elfName = elfNames[Math.floor(Math.random() * elfNames.length)];
            }
            this.playerElfIds.push({ elfId, elfName });
            this.load.image(elfId, `imgs/elves/${elfId}.png`);
        }
        let numOfWombleyElves = 10;
        this.wombleyElfIds = [];
        for (let i = 0; i < numOfWombleyElves; i++) {
            let elfId = elfIds[Math.floor(Math.random() * elfIds.length)];
            while (this.wombleyElfIds.includes(elfId) && this.playerElfIds.includes(elfId)) {
                elfId = elfIds[Math.floor(Math.random() * elfIds.length)];
            }
            let elfName = elfNames[Math.floor(Math.random() * elfNames.length)];
            while (this.wombleyElfIds.includes(elfName) && this.playerElfIds.includes(elfName)) {
                elfName = elfNames[Math.floor(Math.random() * elfNames.length)];
            }
            this.wombleyElfIds.push({ elfId, elfName });
            this.load.image(elfId, `imgs/elves/${elfId}.png`);
        }
    }
    setupElfSaySomething(elf, isWomb) {
        elf.saySomething = (textToSay, extraYoffset = 0) => {
            let x = elf.x;
            let y = elf.y;
            if (elf.originalXY) {
                x = elf.originalXY.x;
                y = elf.originalXY.y;
            }
            let bubble_X = x + 30;
            let bubble_Y = y - elf.displayHeight - 30;
            if (extraYoffset !== 0) {
                bubble_Y += extraYoffset;
            }
            if (!isWomb) {
                bubble_X = x - 30;
            }
            // Add an image at z-depth of 1 when the elf throws a snowball
            let chat_bubble = this.add.image(bubble_X, bubble_Y, 'chat_bubble').setDepth(1).setScale(0.45, 0.27).setOrigin(0);
            if (!isWomb) {
                chat_bubble.flipX = true;
                chat_bubble.setOrigin(1, 0);
            }

            let textX = bubble_X + (chat_bubble.displayWidth / 2);
            let textY = bubble_Y + 20;
            if (!isWomb) {
                textX = bubble_X - (chat_bubble.displayWidth / 2);
            }
            let words = textToSay.split(' ');
            // Break the text into 2 lines that fit within the chat bubble
            let numOfWords = words.length;
            if (numOfWords > 2) {
                let wordsPerLine = Math.ceil(numOfWords / 2);
                let firstLine = words.slice(0, wordsPerLine).join(' ');
                let secondLine = words.slice(wordsPerLine).join(' ');
                textToSay = `${firstLine}\n${secondLine}`;
            }
            // Create the chat bubble text above the elf's head
            let chatBubbleText = this.add.text(textX, textY, textToSay, {
                font: "20px Arial",
                fill: "#000000",
            }).setDepth(1).setOrigin(0.5, 0);
            if (numOfWords > 2) {
                chatBubbleText.setPosition(chatBubbleText.x, chatBubbleText.y - (chatBubbleText.displayHeight / 4));
            }
            let cbx = chat_bubble.x + (chat_bubble.displayWidth / 1.8)
            if (!isWomb) {
                cbx = chat_bubble.x - (chat_bubble.displayWidth / 1.8)
            }
            chatBubbleText.setPosition(cbx, chatBubbleText.y);
            this.time.delayedCall(500, () => {
                // Fade out the chat bubble text over 1 second
                this.tweens.add({
                    targets: [chatBubbleText, chat_bubble],
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        chatBubbleText.destroy(); // Remove the text after fading out
                        chat_bubble.destroy();
                    }
                });
            });
        }
    }
    createElfOnPlatform(elfIdAndName, elfuuid, x, y, isWomb = false) {
        let elfId = elfIdAndName.elfId;
        let elfName = elfIdAndName.elfName;
        //console.log('Creating elf', elfId, elfName, x, y, isWomb);
        let platformOffsetY = 25;
        let platFormScale = 0.2;
        let elf = this.add.image(x, y, elfId).setScale(1).setOrigin(0.5, 1).setFlipX(!isWomb).setDepth(1);
        elf.uuid = elfuuid;
        elf.originalXY = { x, y };
        let tx = elf.x - (elf.displayWidth / 1.8)
        let ty = elf.y - 30
        elf.TargetXY = { x, y };
        elf.TargetAngle = 90;
        if (!isWomb) {
            elf.TargetAngle = -90;
            tx = elf.x + (elf.displayWidth / 1.8)
        }
        elf.TargetXY.x = tx;
        elf.TargetXY.y = ty;
        elf.lastTween = null;
        this.setupElfSaySomething(elf, isWomb);
        elf.triggerIncompacitated = (makeThemIncompacitated = false) => {
            if (elf.lastTween) {
                elf.lastTween.stop();
                elf.lastTween.remove();
            }
            if (makeThemIncompacitated) {
                elf.setPosition(elf.originalXY.x, elf.originalXY.y);
                elf.angle = 0;
                elf.isKo = true;
                elf.setTint(this.blueTint);
                elf.lastTween = this.tweens.add({
                    targets: [elf],
                    x: elf.TargetXY.x,
                    y: elf.TargetXY.y,
                    angle: elf.TargetAngle,
                    duration: 200,
                    onComplete: () => {
                        //elf.setPosition(tx, ty);
                        let randomIndex = Math.floor(Math.random() * elfGetHitWords.length);
                        elf.saySomething(elfGetHitWords[randomIndex], 80);
                    }
                });
            } else {
                elf.isKo = false;
                elf.setPosition(elf.TargetXY.x, elf.TargetXY.y);
                elf.angle = elf.TargetAngle;
                elf.lastTween = this.tweens.add({
                    targets: [elf],
                    x: elf.originalXY.x,
                    y: elf.originalXY.y,
                    angle: 0,
                    duration: 200,
                    onComplete: () => {
                        elf.setPosition(elf.originalXY.x, elf.originalXY.y);
                        elf.clearTint();
                    }
                });
            }
        }
        elf.bounds = elf.getBounds()
        elf.name = elfName;
        elf.isWomb = isWomb;
        elf.obj_type = 'elf';
        elf.hitbox = new Phaser.Geom.Rectangle(-elf.bounds.width / 6, -elf.bounds.height / 1.5, elf.bounds.width / 3, elf.bounds.height / 2);


        elf.isKo = false;
        if (y < 900) {
            this.createObjectCenteredAtXOnCanvas(this.bgcanvas, 'ice_platform', x, y + platformOffsetY, platFormScale, 1);
            this.createObjectCenteredAtXOnCanvas(this.bgcanvasBackup, 'ice_platform', x, y + platformOffsetY, platFormScale, 1);
        }

        //let targetElf = isWomb ? this.alabaster : this.wombley;

        //let throwMin = isWomb ? this.wombleyElvesThrowDelayMin : this.alabasterElvesThrowDelayMin;
        //let throwMax = isWomb ? this.wombleyElvesThrowDelayMax : this.alabasterElvesThrowDelayMax;

        this.elves.push(elf);
    }

    VerifyImageObjectLoaded(imageKey, imageUrl, callback) {
        if (this.textures.exists(imageKey)) {
            // The image is already preloaded, run the callback
            callback();
        } else {
            // The image is not preloaded, preload it
            this.load.image(imageKey, imageUrl);
            // Set up a listener for when the image is loaded
            const onComplete = () => {
                // Remove listeners to ensure they don't get called again
                this.load.off('complete', onComplete);
                this.load.off('loaderror', onLoadError);
                // Run the callback
                callback();
            };
            const onLoadError = (file) => {
                // Handle load error
                console.warn(`Failed to load image: ${file.key}`);
                // Remove listeners to ensure they don't get called again
                this.load.off('complete', onComplete);
                this.load.off('loaderror', onLoadError);
                // You might want to call the callback with an error or handle the error differently
                //callback(new Error(`Failed to load image: ${file.key}`));
            };
            this.load.once('complete', onComplete, this);
            this.load.once('loaderror', onLoadError, this);
            // Start the loader
            this.load.start();
        }
    }
    setupPlayer2WithData(data) {
        this.player2.isJoined = true;
        this.setPlayerTextureToDNA(this.player2, data.player.playerDNA);
        // setPlayerPanelsText(player1Ready=null, player1Unfrozen=null, player2Name=null, player2Ready=null, player2Unfrozen=null) {
        this.setPlayerPanelsText(null, null, data.player.username, data.player.isR, !data.player.isKo);
        this.player2.x = data.player.pos.x;
        this.player2.y = data.player.pos.y;
        this.player2.futureX = this.player2.x;
        this.player2.futureY = this.player2.y;
        this.player2.playerId = data.player.playerId;
        this.player2.name = data.player.username;
        this.player2.nameText.setText(data.player.username);
        this.player2.isKo = data.player.isKo;
        this.player2.isWomb = data.player.isWomb;
        this.player2.avatar.defaultXY = { x: this.player2.x, y: this.player2.y };
        this.setPlayer2PanelsVisible(true);
    }
    setupWebSocket() {
        this.ws = new ReconnectingWebSocket(ws_con_str);
        this.ws.sendMessage = (message) => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(message));
            }
        };

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.ws.sendMessage({
                type: 'init'
            });
        };

        this.ws.onclose = () => {
            console.log('WebSocket closed for some reason');
        };

        this.ws.onerror = (err) => {
            console.error('WebSocket error', err);
        };
        this.ws.onmessage = (message) => {
            var data = null;
            try {
                data = JSON.parse(message.data);
                if (this.hasBgDebug) {
                    window.bgDebug(data);
                }
            } catch (e) {
                console.error('Invalid JSON', message.data);
                return;
            }
            if (data.hasOwnProperty('type')) {
                switch (data.type) {
                    case 'player_dna':
                        if (data.playerId === this.player1.playerId) {
                            this.setPlayerTextureToDNA(this.player1, data.dna);
                        } else if (data.playerId === this.player2.playerId) {
                            this.setPlayerTextureToDNA(this.player2, data.dna);
                        }
                        break;
                    case 'server_message':
                        if (data.hasOwnProperty('delay')) {
                            this.showServerMessageWithDelay(data.message, data.delay);
                        } else {
                            this.serverMessageText.setText(data.message);
                            this.serverMessageTextDontShowAnyNewMessages = true;
                        }
                        break;
                    case 'player_pos':
                        if (data.playerId === this.player2.playerId) {
                            this.player2.futureX = data.x;
                            this.player2.futureY = data.y;
                        } else if (data.playerId === this.player1.playerId) {
                            this.player1.x = data.x;
                            this.player1.y = data.y;
                        }
                        break;
                    case 'koTeam':
                        let isWomb = data.team === 'wombley';
                        if (isWomb) {
                            this.wombley.triggerIncompacitated(true);
                        } else {
                            this.alabaster.triggerIncompacitated(true);
                            this.player1.triggerIncompacitated(true);
                            this.player2.triggerIncompacitated(true);
                        }
                        for (let i = 0; i < this.elves.length; i++) {
                            let elf = this.elves[i];
                            if (elf.isWomb === isWomb) {
                                elf.triggerIncompacitated(true);
                            }
                        }
                        break;
                    case 'game_ended':
                        console.log('Game ended', data);
                        if (data.winOrLose) {
                            this.gameWin = true;
                            this.showWinScreen();
                        } else {
                            this.showLoseScreen();
                        }
                        break;
                    //case 'time_update':
                    //    this.clockText.setText(`Time: ${data.time}`);
                    //    break;
                    case 'game_started':
                        this.startTime = Date.now();
                        this.countDownTime = data.time * 1000;
                        this.clockText.setText(`Time: ${data.time}`);
                        let intervalCountDown = setInterval(() => {
                            let timeLeft = this.countDownTime - (Date.now() - this.startTime);
                            if (timeLeft <= 0) {
                                clearInterval(intervalCountDown);
                            }
                            this.clockText.setText(`Time: ${Math.max(0, Math.floor(timeLeft / 1000))}`);
                        }, 1000);
                        break;
                    case 'snowball':
                        let owner = this.elves.find(elf => elf.uuid === data.owner);
                        if (owner) {
                            this.fireOffCharacterSnowball(data.x, data.y, data.velocityX, data.velocityY, data.blastRadius, owner, data.id, data.isWomb);
                            if (owner.hasOwnProperty('saySomething')) {
                                //const randomChatText = Phaser.Utils.Array.GetRandom(chatOptionsBeforeThrowing);
                                //owner.saySomething(randomChatText);
                            }
                        }
                        break;
                    case 'ready':
                        //this.setPlayerPanelsText(null, null, data.player.username, data.player.isR, !data.player.isKo);
                        if (data.playerId === this.player1.playerId) {
                            this.scrollintro.destroy();
                            this.ReadyButton.destroy(true);
                            this.setPlayerPanelsText(true, null, null, null, null);
                        } else if (data.playerId === this.player2.playerId) {
                            this.setPlayerPanelsText(null, null, null, true, null);
                        }
                        break;
                    case 'snowballp':
                        if (data.owner === this.player1.playerId) {
                            this.player1.rhand.play('throw');
                            this.fireOffCharacterSnowball(data.x, data.y, data.velocityX, data.velocityY, data.blastRadius, this.player1, data.id, data.isWomb);
                        } else if (data.owner === this.player2.playerId) {
                            this.player2.rhand.play('throw');
                            this.fireOffCharacterSnowball(data.x, data.y, data.velocityX, data.velocityY, data.blastRadius, this.player2, data.id, data.isWomb);
                        }
                        break;
                    case 'close_socket':
                        this.ws.close(1000, 'Normal Closure', { keepClosed: true });
                        setTimeout(() => {
                            this.showLoseScreen();
                        }, 500);
                        break;
                    case 'game_over':
                        //if (mainScene) {
                        //  mainScene.gameOver(data);
                        //}
                        break;
                    case 'init':
                        // console log the keys
                        this.elves.forEach(elf => {
                            elf.destroy();
                        });
                        this.elves = [];
                        for (let i = 0; i < data.alabasterElves.length; i++) {
                            this.createElfOnPlatform(this.playerElfIds[i], data.alabasterElves[i].uuid, data.alabasterElves[i].x, data.alabasterElves[i].y, false);
                        }
                        for (let i = 0; i < data.wombleyElves.length; i++) {
                            this.createElfOnPlatform(this.wombleyElfIds[i], data.wombleyElves[i].uuid, data.wombleyElves[i].x, data.wombleyElves[i].y, true);
                        }
                        if (data.hasOwnProperty('sendPixelMap') && data.sendPixelMap) {
                            this.sendCollidableSceneryData();
                        }
                        // we need to iterate over .players and see if there are any where the key is not the playerId and then set that to player2
                        for (let key in data.players) {
                            if (key !== playerId) {
                                this.setupPlayer2WithData({ player: data.players[key] });
                                break;
                            }
                        }
                        this.setAlabasterWombleyHitsText(null, data.wombley.xHit);
                        this.setAlabasterWombleyHitsText(data.alabaster.xHit, null);
                        // we need to iterate over the keys of data.players and see if there is a player with a key that is not playerId
                        // if so, that is player2
                        //this.setupPlayer2WithData(data)
                        let playerKeys = Object.keys(data.players);
                        for (let i = 0; i < playerKeys.length; i++) {
                            if (playerKeys[i] !== playerId) {
                                this.setupPlayer2WithData({ player: data.players[playerKeys[i]] });
                                break;
                            }
                        }
                        if (data.gameStarted) {
                            this.startTime = Date.now();
                            this.countDownTime = data.time * 1000;
                            this.clockText.setText(`Time: ${data.time}`);
                            let intervalCountDown = setInterval(() => {
                                let timeLeft = this.countDownTime - (Date.now() - this.startTime);
                                if (timeLeft <= 0) {
                                    clearInterval(intervalCountDown);
                                }
                                this.clockText.setText(`Time: ${Math.max(0, Math.floor(timeLeft / 1000))}`);
                            }, 1000);
                        }
                        break;
                    case 'player_joined':
                        if (data.hasOwnProperty("player")) {
                            this.setupPlayer2WithData(data)
                        }
                        break;
                    case 'player_left':
                        if (data.hasOwnProperty("playerId")) {
                            if (data.playerId === this.player2.playerId) {
                                this.setPlayer2PanelsVisible(false);
                                this.player2.isJoined = false;
                                this.player2.x = -1000;
                                this.player2.y = -1000;
                                this.player2.futureX = -1000;
                                this.player2.futureY = -1000;
                            }
                        }
                        break;
                    case 'alWoUp':
                        if (data.alabaster) {
                            this.alabaster.nextPos = data.alabaster.nextPos;
                            //this.alabaster.x = data.alabaster.position.x;
                            this.alabaster.isKo = data.alabaster.isKo;
                            this.alabaster.xHit = data.alabaster.xHit;
                            this.setAlabasterWombleyHitsText(data.alabaster.xHit, null);
                        }
                        if (data.wombley) {
                            this.wombley.nextPos = data.wombley.nextPos;
                            //this.wombley.x = data.wombley.position.x;
                            this.wombley.isKo = data.wombley.isKo;
                            this.wombley.xHit = data.wombley.xHit;
                            this.setAlabasterWombleyHitsText(null, data.wombley.xHit);
                        }
                        break;
                    case 'drawdotat':
                        // {"type": "drawdotat", "x": 100, "y": 100}
                        this.drawDotAt(data.x, data.y);
                        break;
                    case 'eAttr':
                        if (data.hasOwnProperty('uuid') && data.hasOwnProperty('attr') && data.hasOwnProperty('value')) {
                            let elf = this.elves.find(elf => elf.uuid === data.uuid);
                            if (elf) {
                                if (data.attr === 'isKo' && elf.hasOwnProperty('triggerIncompacitated')) {
                                    elf.triggerIncompacitated(data.value);
                                } else {
                                    elf[data.attr] = data.value;
                                }
                            }
                        }
                        break;
                    // "woAttr" : "alAttr"
                    case 'woAttr':
                        if (data.hasOwnProperty('data')) {
                            // need to iterate over data.data array and set the attributes .attr to .value
                            for (let i = 0; i < data.data.length; i++) {
                                let attr = data.data[i];
                                if (attr.attr === 'isKo' && this.wombley.hasOwnProperty('triggerIncompacitated')) {
                                    this.wombley.triggerIncompacitated(attr.value);
                                } else if (attr.attr === 'xHit') {
                                    this.wombley.xHit = attr.value;
                                    this.setAlabasterWombleyHitsText(null, attr.value);
                                } else {
                                    this.wombley[attr.attr] = attr.value;
                                }
                            }
                        }
                        break;
                    case 'alAttr':
                        if (data.hasOwnProperty('data')) {
                            // need to iterate over data.data array and set the attributes .attr to .value
                            for (let i = 0; i < data.data.length; i++) {
                                let attr = data.data[i];
                                if (attr.attr === 'isKo' && this.alabaster.hasOwnProperty('triggerIncompacitated')) {
                                    this.alabaster.triggerIncompacitated(attr.value);
                                } else if (attr.attr === 'xHit') {
                                    this.alabaster.xHit = attr.value;
                                    this.setAlabasterWombleyHitsText(attr.value, null);
                                } else {
                                    this.alabaster[attr.attr] = attr.value;
                                }
                            }
                        }
                        break;
                    case 'sbh':
                        let projectile = this.projectiles.getChildren().find(p => p.id === data.id);
                        if (projectile) {
                            // already tracked on server, so we just need to animate it
                            this.animateSnowballHit({ x: data.x, y: data.y }, projectile, false, true)
                        }
                        break;
                    case 'plyAttr':
                        if (data.hasOwnProperty('uuid') && data.hasOwnProperty('data')) {
                            if (data.uuid === this.player1.playerId) {
                                // iterate over data.data array and set the attributes .attr to .value
                                for (let i = 0; i < data.data.length; i++) {
                                    let attr = data.data[i];
                                    if (attr.attr === 'isKo' && this.player1.hasOwnProperty('triggerIncompacitated')) {
                                        this.player1.triggerIncompacitated(attr.value);
                                        this.setPlayerPanelsText(null, !attr.value, null, null, null);
                                    } else {

                                    }
                                    this.player1[attr.attr] = attr.value;
                                }
                            } else if (data.uuid === this.player2.playerId) {
                                // iterate over data.data array and set the attributes .attr to .value
                                for (let i = 0; i < data.data.length; i++) {
                                    let attr = data.data[i];
                                    if (attr.attr === 'isKo' && this.player2.hasOwnProperty('triggerIncompacitated')) {
                                        this.player2.triggerIncompacitated(attr.value);
                                        this.setPlayerPanelsText(null, null, null, null, !attr.value);
                                    } else {

                                    }
                                    this.player2[attr.attr] = attr.value;
                                }
                            }
                        }
                        break;
                    default:
                        console.log('Unknown data type', data.type);
                        break;
                }
            } else {
                console.log('No data.type', data);
            }
        };
    }
    setPlayerTextureToDNA(playerObj, playerDNA) {
        // https://2023.holidayhackchallenge.com/images/export/ATATATTAATATATATATATTACGATATATATCGGCGCCGATATATATATATATTAATATATATATATTAATATATTACGATATATATATATGCGCATATATATATATTAGCATATTAGC.png
        if (playerDNA.includes('avatar')) {
            return;
        }
        let playerDNAurl = '/dnaloader/' + encodeURIComponent(playerDNA) + '.png'
        this.VerifyImageObjectLoaded(playerDNA, playerDNAurl, () => {
            playerObj.avatar.setTexture(playerDNA);
        });
    }
    drawDotAt(x, y) {
        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(x, y, 5);
    }
    sendCollidableSceneryData() {
        let backupContext = this.bgcanvasBackup.context;
        let imageData = backupContext.getImageData(0, 0, GAME_WIDTH, GAME_HEIGHT);
        let data = imageData.data; // The pixel data (RGBA format)
        let width = GAME_WIDTH;
        let height = GAME_HEIGHT;
        // Array to store the transparency map
        let transparencyMap = [];
        // Iterate over each pixel
        for (let y = 0; y < height; y++) {
            let row = [];
            for (let x = 0; x < width; x++) {
                // Calculate the index of the current pixel's alpha value in the data array
                let index = (y * width + x) * 4 + 3; // The alpha value is at the 4th position (index + 3) for each pixel
                let alpha = data[index]; // Get the alpha value (0-255)
                // Determine if the pixel is fully transparent (alpha = 0)
                row.push(alpha === 0 ? 0 : 1);
            }
            transparencyMap.push(row);
        }
        this.ws.sendMessage({
            type: 'pixel_map',
            pixel_map: transparencyMap
        });
    }
    create() {
        this.setupWebSocket();
        mainScene = this;
        if (this.isFirefox) {
            console.error("Firefox detected, please use Chrome or Safari for best experience!");
            this.add.text(5, GAME_HEIGHT - 5, "  Runs best in\nChrome or Safari!", { fontSize: '25px', fill: '#fff', fontFamily: 'monospace', stroke: '#000000', strokeThickness: 8 }).setOrigin(0, 1).setDepth(10);
        }
        this.snowBallBlastRadius = 24;
        this.onlyMoveHorizontally = true;
        this.projectiles = this.physics.add.group();
        this.elves = [];
        this.setupBackgroundImages();
        this.setResetDestructibleScenery();
        this.anims.create({
            key: 'throw',
            frames: this.anims.generateFrameNumbers('hand_sh', { start: 0, end: 13 }),
            frameRate: 70,
            repeat: 0,
            hideOnComplete: false
        });
        this.player1 = this.add.container(starting_pos.x, starting_pos.y);
        this.player1.name = username;
        this.player1.playerId = playerId;
        this.player1.obj_type = 'player';
        this.player1.isMovingLeft = false;
        this.player1.isMovingRight = false;
        this.player1.isMovingUp = false;
        this.player1.isMovingDown = false;
        this.player1.avatar = this.add.image(0, 0, 'avatar1').setScale(1).setOrigin(0.5, 1);
        this.player1.avatar.flippedXY = { x: 0, y: 0 }
        this.player1.avatar.defaultFlipX = false;
        this.player1.avatar.defaultXY = { x: 0, y: 0 }
        this.player1.isWomb = false;
        this.player1.isKo = false;
        this.player1archgraphics = this.add.graphics().setDepth(3);
        this.player1.add(this.player1.avatar);
        this.setupPlayerHands(this.player1)
        this.setupPlayerWalkAnimations(this.player1)
        this.player1.triggerIncompacitated = (makeThemIncompacitated = false) => {
            if (makeThemIncompacitated) {
                this.player1.avatar.setTint(this.blueTint);
                this.stopWalkAnimationTweensIfStarted(this.player1)
            } else if (this.player1.isMovingLeft || this.player1.isMovingRight || this.player1.isMovingUp || this.player1.isMovingDown) {
                this.startWalkAnimationTweensIfNotStarted(this.player1)
                this.player1.avatar.clearTint();
            } else {
                this.player1.avatar.clearTint();
            }
        }
        this.player1.nameText = this.add.text(0, -this.player1.avatar.displayHeight, username, { font: '25px Arial', fill: '#fff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5, 0);
        this.player1.add(this.player1.nameText);
        this.setupPlayer1sRangeArrows();
        this.setPlayerTextureToDNA(this.player1, playerDNA);
        // next lets setup P2 except no range arrows
        this.player2 = this.add.container(-1000, -1000); // start off screen
        this.player2.lastTimeMoved = 0;
        this.player2.futureX = -1000;
        this.player2.futureY = -1000;
        this.player2.playerId = "";
        this.player2.obj_type = 'player';
        this.player2.isMovingLeft = false;
        this.player2.isMovingRight = false;
        this.player2.name = "player2";
        this.player2.isWomb = false;
        this.player2.avatar = this.add.image(0, 0, 'avatar2').setScale(1).setOrigin(0.5, 1);
        this.player2.avatar.flippedXY = { x: 0, y: 0 }
        this.player2.avatar.defaultFlipX = false;
        this.player2.isKo = false;
        this.player2.add(this.player2.avatar);
        this.player2.nameText = this.add.text(0, -this.player2.avatar.displayHeight, '', { font: '25px Arial', fill: '#fff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5, 0);
        this.player2.add(this.player2.nameText);
        this.setupPlayerHands(this.player2)
        this.setupPlayerWalkAnimations(this.player2)

        this.setupAlabasterAndWombleyWithWalkAnims();
        this.setupPlayerBindings();
        this.player2.triggerIncompacitated = (makeThemIncompacitated = false) => {
            if (makeThemIncompacitated) {
                this.player2.avatar.setTint(this.blueTint);
                this.stopWalkAnimationTweensIfStarted(this.player2, true)
                //} else if (this.player2.isMovingLeft || this.player2.isMovingRight || this.player2.isMovingUp || this.player2.isMovingDown) {
                //this.startWalkAnimationTweensIfNotStarted(this.player1)
                //this.player2.avatar.clearTint();
            } else {
                this.player2.avatar.clearTint();
            }
        }
        // this.createElfOnPlatform(this.playerElfIds[0], 500, 500);
        this.input.on('pointerdown', function (pointer) {
            // console.log('{"x":', pointer.x, ', "y":', pointer.y, "}");
        }, this);
        this.player1LastReportedPos = { x: starting_pos.x, y: starting_pos.y };
        this.player1PosSync = this.time.addEvent({
            delay: 75,
            callback: () => {
                if (this.player1.x !== this.player1LastReportedPos.x || this.player1.y !== this.player1LastReportedPos.y) {
                    this.player1LastReportedPos = { x: this.player1.x, y: this.player1.y };
                    this.ws.sendMessage({
                        type: 'player_pos',
                        x: this.player1.x,
                        y: this.player1.y,
                        playerId: this.player1.playerId
                    });
                }
            },
            callbackScope: this,
            loop: true
        });
        this.setupReadyButtonAndIntroScroll();
        this.setupStatusPanels();
    }
    setupStatusPanels() {
        let padding = 5;
        let panelWidth = 300;
        let fontSize = 25;

        // Panel for Player details (placed first on the left)
        this.playerPanel = this.add.image(padding, padding, 'panel').setOrigin(0, 0).setDisplaySize(panelWidth, 275);
        this.playerTextObjects = {};

        // Define the player text content with keys for easier access
        const playerTextContent = {
            player1Name: 'P1 Name: ' + this.player1.name,
            player1Ready: 'P1 Ready:  ❌',
            player1Unfrozen: 'P1 Unfrozen:  ✅',
            player2Name: 'P2 Name: Not Joined',
            player2Ready: 'P2 Ready:  ❌',
            player2Unfrozen: 'P2 Unfrozen:  ✅'
        };
        //✅ ❌

        let xoffset = padding + (padding * 5);
        let yoffset = padding + (padding * 4);

        // Create text objects for each line and store them in this.playerTextObjects
        let index = 0;
        for (const key in playerTextContent) {
            const textObject = this.add.text(xoffset, yoffset + (index * fontSize) + (padding * index), playerTextContent[key], {
                font: `${fontSize}px Courier Bold`,
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8
            }).setOrigin(0, 0);
            this.playerTextObjects[key] = textObject;
            index++;
        }

        // Store the player panel and text objects for easy access
        this.playerPanelContainer = {
            panel: this.playerPanel,
            textObjects: this.playerTextObjects
        };

        // Adjust the x position for the Alabaster Hits panel based on the width of the player panel
        let alabasterXOffset = this.playerPanel.x + this.playerPanel.displayWidth + padding;

        // Alabaster Hits panel (placed to the right of the player panel)
        this.alabasterPanel = this.add.image(alabasterXOffset, padding, 'panel').setOrigin(0, 0).setDisplaySize(panelWidth, 60);
        this.alabasterText = this.add.text(this.alabasterPanel.x + (this.alabasterPanel.displayWidth / 2), this.alabasterPanel.y + (this.alabasterPanel.displayHeight / 2) - 2, 'Alabaster Hits: 0', {
            font: `${fontSize}px Courier Bold`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5, 0.5);

        // Store the Alabaster panel and text for easy access
        this.alabasterPanelContainer = {
            panel: this.alabasterPanel,
            text: this.alabasterText
        };
        // Top-right panel for Wombley Hits
        xoffset = GAME_WIDTH - (padding * 2) - (panelWidth);
        this.wombleyPanel = this.add.image(xoffset, padding, 'panel').setOrigin(1, 0).setDisplaySize(panelWidth, 60);
        this.wombleyText = this.add.text(this.wombleyPanel.x - (this.wombleyPanel.displayWidth / 2), this.wombleyPanel.y + (this.wombleyPanel.displayHeight / 2) - 2, 'Wombley Hits: 0', {
            font: `${fontSize}px Courier Bold`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5, 0.5);

        // Store in this for easy access
        this.wombleyPanelContainer = {
            panel: this.wombleyPanel,
            text: this.wombleyText
        };
        this.playerPanelContainer.textObjects.player2Ready.setVisible(false);
        this.playerPanelContainer.textObjects.player2Unfrozen.setVisible(false);

        this.clockPanel = this.add.image(GAME_WIDTH / 2, padding, 'panel').setOrigin(0.5, 0).setDisplaySize(200, 60);
        this.moasb = () => { this.ws.sendMessage({ type: 'moasb' }) }
        this.clockText = this.add.text(this.clockPanel.x, this.clockPanel.y + (this.clockPanel.displayHeight / 2) - padding, 'Time: 0', {
            font: `${fontSize}px Courier Bold`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5, 0.5);
        /*
        this.roomIdText = this.add.text(GAME_WIDTH /2, GAME_HEIGHT, 'Room ID: ' + roomId, {
            font: `35px Arial Bold`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5, 1);
        */
        this.createRoomIdText(roomId);
        this.serverMessageText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT, "", {
            font: `25px Arial Bold`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5, 1)
        this.serverMessageTextDontShowAnyNewMessages = false;
        this.lastCallTimeout = null;
    }
    showServerMessageWithDelay(message, delay) {
        if (this.serverMessageTextDontShowAnyNewMessages) {
            return;
        }
        if (typeof this.lastCallTimeout === 'number') {
            clearTimeout(this.lastCallTimeout);
        }
        this.serverMessageText.setText(message);
        this.lastCallTimeout = setTimeout(() => {
            this.serverMessageText.setText('');
        }, delay);
    }
    createRoomIdText(roomId) {
        // Create a new div element
        const roomIdDiv = document.createElement('div');
        // Set the text content
        roomIdDiv.textContent = `Room ID: ${roomId}`;
        // Apply styles for positioning and appearance
        Object.assign(roomIdDiv.style, {
            position: 'fixed',
            top: '5px',
            right: '5px',
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#ffffff',
            textShadow: '2px 2px 4px #000000',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '5px',
            zIndex: '1000',
            userSelect: 'text' // Allows the user to highlight and select the text
        });
        // Append the element to the body
        document.body.appendChild(roomIdDiv);
    }
    setAlabasterWombleyHitsText(alabasterHits = null, wombleyHits = null) {
        if (alabasterHits !== null) {
            this.alabasterPanelContainer.text.setText('Alabaster Hits: ' + alabasterHits);
        }
        if (wombleyHits !== null) {
            this.wombleyPanelContainer.text.setText('Wombley Hits: ' + wombleyHits);
        }
    }
    setPlayerPanelsText(player1Ready = null, player1Unfrozen = null, player2Name = null, player2Ready = null, player2Unfrozen = null) {
        if (player2Name !== null) {
            this.playerPanelContainer.textObjects.player2Name.setText('P2 Name: ' + player2Name);
        }
        if (player1Ready !== null) {
            this.playerPanelContainer.textObjects.player1Ready.setText('P1 Ready: ' + (player1Ready ? '✅' : '❌'));
        }
        if (player1Unfrozen !== null) {
            this.playerPanelContainer.textObjects.player1Unfrozen.setText('P1 Unfrozen: ' + (player1Unfrozen ? '✅' : '❌'));
        }
        if (player2Ready !== null) {
            this.playerPanelContainer.textObjects.player2Ready.setText('P2 Ready: ' + (player2Ready ? '✅' : '❌'));
        }
        if (player2Unfrozen !== null) {
            this.playerPanelContainer.textObjects.player2Unfrozen.setText('P2 Unfrozen: ' + (player2Unfrozen ? '✅' : '❌'));
        }
    }
    setPlayer2PanelsVisible(isVisible) {
        this.playerPanelContainer.textObjects.player2Ready.setVisible(isVisible);
        this.playerPanelContainer.textObjects.player2Unfrozen.setVisible(isVisible);
        if (!isVisible) {
            this.playerPanelContainer.textObjects.player2Name.setText('P2 Name: Not Joined');
        }
    }
    setupReadyButtonAndIntroScroll() {
        let buttonWidth = 150;
        let buttonHeight = 50;
        let cornerRadius = 15;

        let buttonGraphics = this.add.graphics();
        buttonGraphics.fillStyle(0xF5624D, 1);  // Fill color: red
        buttonGraphics.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);  // Centered at (0, 0)
        buttonGraphics.lineStyle(4, 0xffffff, 1);  // Border color: white, line thickness: 4
        buttonGraphics.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);  // Stroke the border
        buttonGraphics.setDepth(999997);

        this.scrollintro = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'scrollintro').setOrigin(0.5).setDepth(10).setScale(1.3);

        this.ReadyButtonText = this.add.text(-buttonWidth / 2 + 30, -buttonHeight / 2 + 8, 'Ready', {
            fontFamily: "Arial",
            fontSize: '30px',
            fill: '#ffffff'
        });  // Adjust text position relative to the centered graphics

        // Group the graphics and text objects to handle them as a single button
        this.ReadyButton = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2, [buttonGraphics, this.ReadyButtonText]).setDepth(11);

        // Set the interactive area to the bounds of the graphics object
        this.ReadyButton.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

        // Add pointer events to change the button appearance and handle clicks
        this.ReadyButton.on('pointerover', () => {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x34A65F, 1);  // Change fill color to green on hover
            buttonGraphics.lineStyle(4, 0xffffff, 1);
            buttonGraphics.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
            buttonGraphics.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        });

        this.ReadyButton.on('pointerout', () => {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0xF5624D, 1);  // Change fill color back to red
            buttonGraphics.lineStyle(4, 0xffffff, 1);
            buttonGraphics.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
            buttonGraphics.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        });

        this.ReadyButton.on('pointerdown', () => {
            this.ws.sendMessage({ "type": "ready" })
        });
        this.ReadyButton.setScale(1.5).setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 1.22);

        //this.load.image('alab_base_smile', 'imgs/alab_base_smile.png')
        //this.load.image('alab_base_sad', 'imgs/alab_base_sad.png')
        this.end_scroll = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'scroll').setOrigin(0.5).setDepth(12).setScale(1.3);
        this.win_text_above = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 300, 'YOU DEFEATED WOMBLEY!', { fontFamily: "Arial", fontSize: '50px', fill: '#ffffff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setDepth(13);
        this.lose_text_above = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 300, 'WOMBLEY DEFEATED YOU!', { fontFamily: "Arial", fontSize: '50px', fill: '#ffffff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setDepth(13);
        this.alab_base_smile = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'alab_base_smile').setOrigin(0.5).setDepth(12).setScale(1.5);
        this.alab_base_sad = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'alab_base_sad').setOrigin(0.5).setDepth(12).setScale(1.5);
        this.win_text_below = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 300, 'Thank you, you helped us defeat wombley cube!\n   We are one step closer to foiling his plans.', { fontFamily: "Arial", fontSize: '25px', fill: '#ffffff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setDepth(13);
        this.lose_text_below = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 300, '        Oh no, Wombley defeated us!\n   Please try again so we can foil his plans.', { fontFamily: "Arial", fontSize: '25px', fill: '#ffffff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setDepth(13);
        this.end_scroll.setVisible(false);
        this.win_text_above.setVisible(false);
        this.lose_text_above.setVisible(false);
        this.alab_base_smile.setVisible(false);
        this.alab_base_sad.setVisible(false);
        this.win_text_below.setVisible(false);
        this.lose_text_below.setVisible(false);
    }
    showWinScreen() {
        this.end_scroll.setVisible(true);
        this.win_text_above.setVisible(true);
        this.alab_base_smile.setVisible(true);
        this.win_text_below.setVisible(true);
    }
    showLoseScreen() {
        if (this.gameWin) {
            return;
        }
        this.end_scroll.setVisible(true);
        this.lose_text_above.setVisible(true);
        this.alab_base_sad.setVisible(true);
        this.lose_text_below.setVisible(true);
    }
    findAValidPath(startX, startY, endX, endY, rangeOfAngles = 40, doNotCheckIfOversecting = true) {
        // Straight up is -90 degrees. And straight left-to-right is 0 degrees.
        let upAngle = -90;
        let startAngle = upAngle - rangeOfAngles;
        let endAngle = upAngle + rangeOfAngles;
        let degreesToCheck = [];
        for (let i = startAngle; i <= endAngle; i++) {
            degreesToCheck.push(i);
        }
        let throwSpeedsToCheck = [];
        for (let i = 0.1; i <= 1.0; i += 0.1) {
            throwSpeedsToCheck.push(i * this.throwSpeed);
        }
        let allPaths = [];
        degreesToCheck.forEach(angle => {
            throwSpeedsToCheck.forEach(speed => {
                let { velocityX, velocityY } = this.calculateVelocityFromAngle(angle, speed);
                let path = this.calculateProjectilePath(startX, startY, velocityX, velocityY, 1000, false);
                allPaths.push({ angle, speed, velocityX, velocityY, path });
            });
        });
        let validPaths = [];
        // next we need to iterate over allPaths and if any of the paths have even one this.isOverlapping([{ x: x0, y: y0 }], this.bgcanvas), then we discard that path
        allPaths.forEach(path => {
            let overlapping = false;
            if (!doNotCheckIfOversecting) {
                path.path.forEach(point => {
                    if (this.isOverlapping([{ x: point.x, y: point.y }], this.bgcanvas)) {
                        overlapping = true;
                    }
                });
            }
            if (!overlapping) {
                validPaths.push(path);
            }
        });
        // Next, we want to find the path with the point closest to the endX, endY
        let closestPath = null;
        let closestDistance = Infinity;
        validPaths.forEach(path => {
            let lastPoint = path.path[path.path.length - 1];
            let distance = Phaser.Math.Distance.Between(lastPoint.x, lastPoint.y, endX, endY);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPath = path;
            }
        });
        return closestPath;
    }
    setupPlayer1sRangeArrows() {
        let numOfArrows = 5
        this.player1.rangeArrows = []
        let baseScale = 0.2
        for (let i = 0; i < numOfArrows; i++) {
            let arrScale = baseScale + (i * 0.1)
            let arrow = this.add.image(200 + (i * 60), 200, 'arrow').setScale(arrScale).setOrigin(0.5, 0.5).setDepth(1);
            arrow.setVisible(false)
            this.player1.rangeArrows.push(arrow)
        }
        this.player1.powerText = this.add.text(0, 0, '300', { font: "26px Arial", fill: "#ffffff", stroke: '#000', strokeThickness: 6 }).setDepth(1);
        this.player1.powerText.setVisible(false)
    }
    // Straight up is -90 degrees. And straight left-to-right is 0 degrees.
    calculateVelocityFromAngle(angleDegrees, speed) {
        // Convert the angle from degrees to radians
        const angleRadians = Phaser.Math.DegToRad(angleDegrees);
        // Calculate the x and y velocity components
        const velocityX = Math.cos(angleRadians) * speed;
        const velocityY = Math.sin(angleRadians) * speed;
        return { velocityX, velocityY };
    }
    calculateProjectilePath(startX, startY, velocityX, velocityY, excludePointsOnYGreaterThan = 1000, debug = false) {
        const gravity = 300; // Gravity as defined in the game config
        const timeStep = 0.016; // Assuming 60 FPS, each frame is approximately 16ms
        const maxPoints = 800; // Maximum number of points to calculate
        const stepDistance = 20; // Distance between each point in pixels
        const path = [];

        let currentX = startX;
        let currentY = startY;
        let currentVelocityX = velocityX;
        let currentVelocityY = velocityY;
        let totalDistance = 0;

        for (let i = 0; i < maxPoints; i++) {
            // Apply gravity to the velocity
            currentVelocityY += gravity * timeStep;

            // Calculate the next position
            let nextX = currentX + currentVelocityX * timeStep;
            let nextY = currentY + currentVelocityY * timeStep;

            // Calculate the distance from the current point to the next
            let distance = Phaser.Math.Distance.Between(currentX, currentY, nextX, nextY);
            totalDistance += distance;

            // Only add points that are approximately 4 pixels apart
            if (totalDistance >= stepDistance) {
                path.push({ x: nextX, y: nextY });
                totalDistance = 0;

                if (debug) {
                    let graphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });
                    graphics.fillCircle(nextX, nextY, 2);
                }
            }

            // Update current position
            currentX = nextX;
            currentY = nextY;
            if (currentY > excludePointsOnYGreaterThan) {
                break;
            }
            // Break if the projectile would be out of bounds
            if (currentY > GAME_HEIGHT || currentX < 0 || currentX > GAME_WIDTH) {
                break;
            }
        }
        return path;
    }
    checkIfSnowballPointIsInNonOwnerHitbox(xypoint, owner, isWomb) {
        let possibleTargets = [this.alabaster, this.wombley, this.player1, this.player2, ...this.elves];
        possibleTargets = possibleTargets.filter(target => target.isWomb !== isWomb && !target.isKo);
        let hitTarget = possibleTargets.find(target => {
            // Adjust the hitbox position based on the target's center point (x, y)
            /*
            let adjustedHitbox = new Phaser.Geom.Rectangle(
                target.x - target.hitbox.width / 2,
                target.y - target.hitbox.height / 2,
                target.hitbox.width,
                target.hitbox.height
            );
            */
            let adjustedHitbox = target.hitbox;
            if (target.obj_type === 'elfcap') {
                adjustedHitbox = new Phaser.Geom.Rectangle(
                    target.x - target.hitbox.width / 2,
                    target.y - (target.hitbox.height * 0.4),
                    target.hitbox.width,
                    target.hitbox.height
                );
            } else if (target.obj_type === 'elf') {
                adjustedHitbox = new Phaser.Geom.Rectangle(
                    target.x - target.hitbox.width / 2,
                    target.y - (target.hitbox.height * 1.3),
                    target.hitbox.width,
                    target.hitbox.height
                );
            } else if (target.obj_type === 'player') {
                adjustedHitbox = new Phaser.Geom.Rectangle(
                    target.x - target.hitbox.width / 2,
                    target.y - (target.hitbox.height * 1.3),
                    target.hitbox.width,
                    target.hitbox.height
                );
            }
            if (Phaser.Geom.Rectangle.ContainsPoint(adjustedHitbox, xypoint)) {
                return true;
            }
        });
        if (hitTarget) {
            return hitTarget;
        }
    }
    fireOffCharacterSnowball(startX, startY, velocityX, velocityY, blastRadius, owner, id, isWomb) {
        let newProjectileSnowball = this.physics.add.image(startX, startY, 'snowball').setDepth(4);
        newProjectileSnowball.creationTime = this.time.now;
        newProjectileSnowball.lastPos = { x: startX, y: startY };
        newProjectileSnowball.isWomb = isWomb;
        newProjectileSnowball.owner = owner;
        newProjectileSnowball.id = id;
        newProjectileSnowball.blastRadius = blastRadius;
        if (isWomb) {
            newProjectileSnowball.setTint(this.yellowTint);
        }
        // Enable world bounds check and destroy the snowball if it goes out of bounds
        this.projectiles.add(newProjectileSnowball);
        // Set the velocity of the new snowball projectile
        newProjectileSnowball.setVelocity(velocityX, velocityY);
    }
    calcSnowballTrajectory(pointer, owner, archonly = false) {
        // Check if the percentage shot power is zero or if the throw rate limit is exceeded
        if ((this.percentageShotPower <= 0 || this.lastThrowTime + this.throwRateOfFire > this.time.now) && !archonly) {
            return;
        }
        if (!archonly) {
            // Update the last throw time
            this.lastThrowTime = this.time.now;
        }

        // Get the snowball's world position
        let snowBallPosition = this.getWorldPosition(owner.snowball);

        // Calculate the direction vector from the snowball to the pointer
        let direction = new Phaser.Math.Vector2(pointer.x - snowBallPosition.x, pointer.y - snowBallPosition.y);
        // Normalize the direction vector
        direction.normalize();

        // Calculate the speed based on throw speed and percentage shot power
        let speed = this.throwSpeed * this.percentageShotPower;
        let velocityX = direction.x * speed;
        let velocityY = direction.y * speed;
        if (archonly) {
            // Clear the previous arch graphics
            this.player1archgraphics.clear();
            this.player1archgraphics.lineStyle(2, 0xffe6e6, 1);

            let gravity = 300; // Gravity value
            let timeStep = 0.050; // Time step for calculations
            let maxDistance = 2400; // Maximum distance in pixels

            // Start drawing the path
            this.player1archgraphics.beginPath();
            this.player1archgraphics.moveTo(snowBallPosition.x, snowBallPosition.y);

            let currentX = snowBallPosition.x;
            let currentY = snowBallPosition.y;
            let totalTime = 0;

            // Calculate the path of the projectile
            while (currentX < snowBallPosition.x + maxDistance) {
                totalTime += timeStep;
                // Update positions using kinematic equations
                let x = snowBallPosition.x + velocityX * totalTime;
                let y = snowBallPosition.y + velocityY * totalTime + 0.5 * gravity * totalTime * totalTime;

                // Stop if the projectile would hit the ground
                if (y >= this.scale.height) {
                    break;
                }

                this.player1archgraphics.lineTo(x, y);
                currentX = x;
                currentY = y;
            }

            this.player1archgraphics.strokePath();
            this.player1archgraphics.closePath();
        } else {
            /*
            // Create a new snowball projectile at the snowball's position
            let newProjectileSnowball = this.physics.add.image(snowBallPosition.x, snowBallPosition.y, 'snowball').setDepth(2);
            newProjectileSnowball.creationTime = this.time.now;
            newProjectileSnowball.owner = owner;
            newProjectileSnowball.lastPos = { x: newProjectileSnowball.x, y: newProjectileSnowball.y };

            // Enable world bounds check and destroy the snowball if it goes out of bounds
            this.projectiles.add(newProjectileSnowball);

            // Set the velocity of the new snowball projectile
            newProjectileSnowball.setVelocity(velocityX, velocityY);
            */
            let snowball = {
                "type": "snowballp",
                "x": snowBallPosition.x,
                "y": snowBallPosition.y,
                "owner": this.player1.playerId,
                "isWomb": this.player1.isWomb,
                "blastRadius": this.snowBallBlastRadius,
                "velocityX": velocityX,
                "velocityY": velocityY
            };
            this.ws.sendMessage(snowball);
        }
    }

    arrangePlayer1ArrowsBetweenMouseAndPlayer() {
        // Get the world position of the snowball
        let snowBallPosition = this.getWorldPosition(this.player1.snowball);
        // Calculate the distance between the snowball and the pointer
        let distanceBetweenSnowballAndLastPointer = Phaser.Math.Distance.Between(snowBallPosition.x, snowBallPosition.y, this.lastPointerPosition.x, this.lastPointerPosition.y);
        // Offset to account for the arrow not starting at the snowball
        //let offset = 40; // Adjust this value as needed
        let mindisplaydistance = 60;
        let maxDisplayDistance = 800;
        //let percentageToShowEveryNthArrow = 0.05; // Define the 10% increment

        // Check if the distance is less than the minimum display distance
        /*
        if (!this.mouseIsOverCanvas || distanceBetweenSnowballAndLastPointer < mindisplaydistance) {
            // Hide all arrows if the distance is less than the minimum display distance
            this.player1.rangeArrows.forEach(arrow => arrow.setVisible(false));
            this.player1.powerText.setVisible(false);
            this.percentageShotPower = 0;
            return;
        }
        */

        // Cap the distance at the maximum display distance
        distanceBetweenSnowballAndLastPointer = Math.min(distanceBetweenSnowballAndLastPointer, maxDisplayDistance);

        // Calculate the angle between the snowball and the pointer
        let angleBetweenSnowballAndLastPointer = Phaser.Math.Angle.Between(snowBallPosition.x, snowBallPosition.y, this.lastPointerPosition.x, this.lastPointerPosition.y);
        // Calculate the total arrow count
        //let arrowCount = this.player1.rangeArrows.length;
        // Calculate the distance between arrows, considering the offset at the start and end
        //let distanceBetweenArrows = (distanceBetweenSnowballAndLastPointer - offset) / (arrowCount - 1);
        // Angle offset if the player avatar is flipped
        //let angleOffset = 0;
        // Additional rotation of 90 degrees in radians
        //let additionalRotation = Phaser.Math.DegToRad(90);

        // Calculate the percentage of distance to determine how many arrows to show
        let distancePercentage = (distanceBetweenSnowballAndLastPointer - mindisplaydistance) / (maxDisplayDistance - mindisplaydistance);
        //let arrowsToShow = Math.floor(distancePercentage / percentageToShowEveryNthArrow); // Calculate number of arrows to show based on 10% increments

        /*
        for (let i = 0; i < arrowCount; i++) {
            let arrow = this.player1.rangeArrows[arrowCount - 1 - i];
            if (i < arrowsToShow) {
                let distanceFromSnowball = offset + distanceBetweenArrows * (arrowCount - 1 - i);
                let arrowX = snowBallPosition.x + Math.cos(angleBetweenSnowballAndLastPointer + angleOffset) * distanceFromSnowball;
                let arrowY = snowBallPosition.y + Math.sin(angleBetweenSnowballAndLastPointer + angleOffset) * distanceFromSnowball;
                arrow.setPosition(arrowX, arrowY);
                arrow.setRotation(angleBetweenSnowballAndLastPointer + angleOffset + additionalRotation);
                arrow.setVisible(true); // Ensure arrows are visible if they meet the distance condition
            } else {
                arrow.setVisible(false); // Hide the arrows that shouldn't be displayed
            }
        }
        */

        this.percentageShotPower = distancePercentage;
        // Update and position the powerText based on maxDisplayDistance
        let percentageText = Math.round(distancePercentage * 100) + "%";
        this.player1.powerText.setText(percentageText);

        let distanceForText = Math.min(distanceBetweenSnowballAndLastPointer, maxDisplayDistance);
        let middleX = snowBallPosition.x + Math.cos(angleBetweenSnowballAndLastPointer) * (distanceForText / 2);
        let middleY = snowBallPosition.y + Math.sin(angleBetweenSnowballAndLastPointer) * (distanceForText / 2);
        this.player1.powerText.setPosition(middleX, middleY);
        this.player1.powerText.setVisible(true);
        this.calcSnowballTrajectory(this.lastPointerPosition, this.player1, true);
    }

    getWorldPosition(image) {
        image.getWorldTransformMatrix(this.tempMatrix, this.tempParentMatrix);
        const d = this.tempMatrix.decomposeMatrix();
        return new Phaser.Geom.Point(d.translateX, d.translateY)
    }
    setupPlayerHands(player_cont_obj) {
        let halfPlayerAvatarHeight = player_cont_obj.avatar.displayHeight / 2;
        let halfPlayerAvatarWidth = player_cont_obj.avatar.displayWidth / 2;
        player_cont_obj.lhand = this.add.image(this.hand_offsets.lx - halfPlayerAvatarWidth, this.hand_offsets.ly - halfPlayerAvatarHeight, 'hand')
        player_cont_obj.lhand.setOrigin(0.5, 0.5)
        player_cont_obj.lhand.setScale(0.06)
        player_cont_obj.lhand.flipX = true;
        player_cont_obj.lhand.defaultFlipX = true;
        player_cont_obj.lhand.defaultXY = {
            x: player_cont_obj.lhand.x,
            y: player_cont_obj.lhand.y
        }
        player_cont_obj.rhand = this.add.sprite(this.hand_offsets.rx, this.hand_offsets.ry - halfPlayerAvatarHeight, 'hand_sh');
        player_cont_obj.rhand.setOrigin(0.5, 0.5)
        player_cont_obj.rhand.setScale(0.4)
        player_cont_obj.rhand.flipX = false;
        player_cont_obj.rhand.defaultFlipX = false;
        player_cont_obj.rhand.defaultXY = {
            x: player_cont_obj.rhand.x,
            y: player_cont_obj.rhand.y
        }
        player_cont_obj.snowball = this.add.image(this.snowball_offset.x, this.snowball_offset.y, 'snowball')
        player_cont_obj.snowball.setOrigin(0.5, 0.5)
        player_cont_obj.snowball.setScale(0.8)
        player_cont_obj.snowball.flipX = false;
        player_cont_obj.snowball.defaultXY = {
            x: player_cont_obj.snowball.x,
            y: player_cont_obj.snowball.y
        }
        player_cont_obj.add([player_cont_obj.lhand, player_cont_obj.rhand, player_cont_obj.snowball])
        player_cont_obj.bounds = player_cont_obj.getBounds()
        player_cont_obj.hitbox = new Phaser.Geom.Rectangle(-player_cont_obj.bounds.width / 6, -player_cont_obj.bounds.height / 1.5, player_cont_obj.bounds.width / 3, player_cont_obj.bounds.height / 2);
        player_cont_obj.hitboxGraphics = this.add.graphics();
        player_cont_obj.hitboxGraphics.lineStyle(4, 0xff0000, 1);
        player_cont_obj.hitboxGraphics.strokeRect(player_cont_obj.hitbox.x, player_cont_obj.hitbox.y, player_cont_obj.hitbox.width, player_cont_obj.hitbox.height);
        player_cont_obj.hitboxPoints = [
            { x: player_cont_obj.hitbox.x, y: player_cont_obj.hitbox.y }, // top-left
            { x: player_cont_obj.hitbox.x + player_cont_obj.hitbox.width, y: player_cont_obj.hitbox.y }, // top-right
            { x: player_cont_obj.hitbox.x, y: player_cont_obj.hitbox.y + player_cont_obj.hitbox.height }, // bottom-left
            { x: player_cont_obj.hitbox.x + player_cont_obj.hitbox.width, y: player_cont_obj.hitbox.y + player_cont_obj.hitbox.height }, // bottom-right
            { x: player_cont_obj.hitbox.x, y: player_cont_obj.hitbox.y + player_cont_obj.hitbox.height / 2 }, // middle-left
            { x: player_cont_obj.hitbox.x + player_cont_obj.hitbox.width, y: player_cont_obj.hitbox.y + player_cont_obj.hitbox.height / 2 } // middle-right
        ];
        // Draw little black dots at each point
        player_cont_obj.hitboxPoints.forEach(point => {
            player_cont_obj.hitboxGraphics.fillStyle(0x000000, 1);
            player_cont_obj.hitboxGraphics.fillCircle(point.x, point.y, 2); // Adjust the radius as needed
        });
        player_cont_obj.add(player_cont_obj.hitboxGraphics);
        player_cont_obj.hitboxGraphics.setVisible(false); // comment out to show hitbox
        player_cont_obj.snowball.flippedXY = { x: -player_cont_obj.snowball.x, y: 0 }
        player_cont_obj.lhand.flippedXY = { x: -player_cont_obj.lhand.x, y: 0 }
        player_cont_obj.rhand.flippedXY = { x: -player_cont_obj.rhand.x, y: 0 }
        player_cont_obj.handsIdleTween = this.tweens.add({
            targets: [player_cont_obj.lhand, player_cont_obj.rhand, player_cont_obj.snowball],
            y: "+=6",
            yoyo: true,
            repeat: -1,
            duration: 1000,
            ease: 'Sine.easeInOut',
            onYoyo: () => { },
            onRepeat: () => { }
        });
        player_cont_obj.rhand.on('animationstart', (animation) => {
            if (animation.key === 'throw') {
                player_cont_obj.snowball.setVisible(false);
            }
        });
        player_cont_obj.rhand.on('animationcomplete', (animation) => {
            if (animation.key === 'throw') {
                player_cont_obj.rhand.setFrame(0);
                player_cont_obj.snowball.setVisible(true);
            }
        });
    }
    stopWalkAnimationTweensIfStarted(playerObjContainer, force = false) {
        if (force || this.player1.isMovingLeft || this.player1.isMovingRight || this.player1.isMovingUp || this.player1.isMovingDown) {
            if (!playerObjContainer.rotate_tween.currentlyPaused) {
                playerObjContainer.rotate_tween.pause();
            }
            if (!playerObjContainer.womble_tween.currentlyPaused) {
                playerObjContainer.womble_tween.pause();
            }
        }
    }
    startWalkAnimationTweensIfNotStarted(playerObjContainer) {
        if (playerObjContainer.rotate_tween.currentlyPaused) {
            playerObjContainer.rotate_tween.resume();
        }
        if (playerObjContainer.womble_tween.currentlyPaused) {
            playerObjContainer.womble_tween.resume();
        }
    }
    setupPlayerWalkAnimations(playerObjContainer) {
        // Rotate tween with pause and resume events
        playerObjContainer.rotate_tween = this.tweens.add({
            targets: playerObjContainer.avatar,
            y: { from: playerObjContainer.avatar.y + 4, to: playerObjContainer.avatar.y - 4 },
            angle: { from: -4, to: 4 },
            yoyo: true,
            repeat: -1,
            duration: 125,
            ease: 'Linear',
            onPause: (tween) => {
                playerObjContainer.rotate_tween.currentlyPaused = true;
            },
            onResume: (tween) => {
                playerObjContainer.rotate_tween.currentlyPaused = false;
            }
        });
        playerObjContainer.rotate_tween.currentlyPaused = false;
        // Womble tween with pause and resume events
        playerObjContainer.womble_tween = this.tweens.add({
            targets: playerObjContainer.avatar,
            angle: { from: -3, to: 3 },
            yoyo: true,
            repeat: -1,
            duration: 250,
            ease: 'Linear',
            onPause: () => {
                playerObjContainer.womble_tween.currentlyPaused = true;
            },
            onResume: () => {
                playerObjContainer.womble_tween.currentlyPaused = false;
            }
        });
        playerObjContainer.womble_tween.currentlyPaused = false;
        this.stopWalkAnimationTweensIfStarted(playerObjContainer, true)
    }
    performPlayerAction(action, downUp) {
        let isKeyDown = downUp === 'down';
        if (action === 'left') {
            if (isKeyDown && !this.player1.isKo) {
                this.startWalkAnimationTweensIfNotStarted(this.player1)
            } else {
                this.stopWalkAnimationTweensIfStarted(this.player1)
            }
            this.player1.isMovingLeft = isKeyDown;
            /*
            this.player1.avatar.flipX = true;
            this.player1.list.forEach(child => {
                if (child.type === "Graphics") { return; }
                child.flipX = !child.defaultFlipX;
                child.setPosition(child.flippedXY.x, child.flippedXY.y);
            });
            */
            //this.player1.rhand.play('throw');
        } else if (action === 'right') {
            if (isKeyDown && !this.player1.isKo) {
                this.startWalkAnimationTweensIfNotStarted(this.player1)
            } else {
                this.stopWalkAnimationTweensIfStarted(this.player1)
            }
            this.player1.isMovingRight = isKeyDown;
            /*
            this.player1.list.forEach(child => {
                if (child.type === "Graphics") { return; }
                child.flipX = child.defaultFlipX
                child.setPosition(child.defaultXY.x, child.defaultXY.y)
            });
            */
            //this.player2.rhand.play('throw');
        } else if (!this.onlyMoveHorizontally && action === 'up') {
            if (isKeyDown && !this.player1.isKo) {
                this.startWalkAnimationTweensIfNotStarted(this.player1)
            } else {
                this.stopWalkAnimationTweensIfStarted(this.player1)
            }
            this.player1.isMovingUp = isKeyDown;
        } else if (!this.onlyMoveHorizontally && action === 'down') {
            if (isKeyDown && !this.player1.isKo) {
                this.startWalkAnimationTweensIfNotStarted(this.player1)
            } else {
                this.stopWalkAnimationTweensIfStarted(this.player1)
            }
            this.player1.isMovingDown = isKeyDown;
        }
    }
    setupPlayerBindings() {
        // Create cursors for arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();
        // Create key objects for WASD keys
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        // Add listeners for keydown events
        this.input.keyboard.on('keydown-W', () => this.performPlayerAction('up', 'down'));
        this.input.keyboard.on('keydown-UP', () => this.performPlayerAction('up', 'down'));
        this.input.keyboard.on('keydown-A', () => this.performPlayerAction('left', 'down'));
        this.input.keyboard.on('keydown-LEFT', () => this.performPlayerAction('left', 'down'));
        this.input.keyboard.on('keydown-S', () => this.performPlayerAction('down', 'down'));
        this.input.keyboard.on('keydown-DOWN', () => this.performPlayerAction('down', 'down'));
        this.input.keyboard.on('keydown-D', () => this.performPlayerAction('right', 'down'));
        this.input.keyboard.on('keydown-RIGHT', () => this.performPlayerAction('right', 'down'));
        // Add listeners for keyup events
        this.input.keyboard.on('keyup-W', () => this.performPlayerAction('up', 'up'));
        this.input.keyboard.on('keyup-UP', () => this.performPlayerAction('up', 'up'));
        this.input.keyboard.on('keyup-A', () => this.performPlayerAction('left', 'up'));
        this.input.keyboard.on('keyup-LEFT', () => this.performPlayerAction('left', 'up'));
        this.input.keyboard.on('keyup-S', () => this.performPlayerAction('down', 'up'));
        this.input.keyboard.on('keyup-DOWN', () => this.performPlayerAction('down', 'up'));
        this.input.keyboard.on('keyup-D', () => this.performPlayerAction('right', 'up'));
        this.input.keyboard.on('keyup-RIGHT', () => this.performPlayerAction('right', 'up'));
        this.input.on('pointermove', (pointer) => {
            this.mouseIsOverCanvas = true;
            this.lastPointerPosition.x = pointer.x;
            this.lastPointerPosition.y = pointer.y;
            this.arrangePlayer1ArrowsBetweenMouseAndPlayer();
        });
        const canvas = this.sys.canvas;
        // Add event listeners for pointerover and pointerout
        canvas.addEventListener('pointerover', () => {
            this.mouseIsOverCanvas = true;
        });
        canvas.addEventListener('pointerout', () => {
            this.mouseIsOverCanvas = false;
            this.arrangePlayer1ArrowsBetweenMouseAndPlayer();
        });
        this.input.on('pointerup', (pointer) => {
            if (pointer.button === 0 && !this.player1.isKo) {
                this.calcSnowballTrajectory(pointer, this.player1);
            }
        });
    }
    setupAlabasterAndWombleyWithWalkAnims() {
        this.wombleyNameText = this.add.text(0, 0, 'Wombley', { font: "20px Arial", fill: "#ffffff", stroke: '#000', strokeThickness: 6 }).setDepth(1).setOrigin(0.5, 0.5);
        this.alabasterNameText = this.add.text(0, 0, 'Alabaster', { font: "20px Arial", fill: "#ffffff", stroke: '#000', strokeThickness: 6 }).setDepth(1).setOrigin(0.5, 0.5);
        // Add Wombley and Alabaster
        this.wombley = this.add.image(this.wombleyXLocation, this.elfGroundOffset, 'wombleycube').setScale(1);
        this.wombley.name = "wombley";
        this.wombley.isWomb = true;
        //this.wombley.isMovingRight = true;
        this.wombley.xHit = 0;
        this.wombley.isKo = false;
        this.wombley.bounds = this.wombley.getBounds()
        this.wombley.obj_type = "elfcap";
        this.wombley.hitbox = new Phaser.Geom.Rectangle(-this.wombley.bounds.width / 6, -this.wombley.bounds.height / 1.5, this.wombley.bounds.width / 3, this.wombley.bounds.height / 2);
        /*
        this.wombley.hitboxGraphics = this.add.graphics();
        this.wombley.hitboxGraphics.lineStyle(4, 0xff0000, 1);
        let adjustedHitbox = new Phaser.Geom.Rectangle(
            this.wombley.x - this.wombley.hitbox.width / 2,
            this.wombley.y - (this.wombley.hitbox.height * 0.4),
            this.wombley.hitbox.width,
            this.wombley.hitbox.height
        );
        this.wombley.hitboxGraphics.strokeRect(adjustedHitbox.x, adjustedHitbox.y, adjustedHitbox.width, adjustedHitbox.height);
        */
        this.alabaster = this.add.image(this.alabasterXLocation, this.elfGroundOffset, 'alabastersnowball').setScale(1).setFlipX(true);
        this.alabaster.name = "alabaster";
        this.alabaster.isWomb = false;
        //this.alabaster.isMovingRight = false;
        this.alabaster.xHit = 0;
        this.alabaster.obj_type = "elfcap";
        this.alabaster.bounds = this.alabaster.getBounds()
        this.alabaster.isKo = false;
        this.alabaster.hitbox = new Phaser.Geom.Rectangle(-this.alabaster.bounds.width / 6, -this.alabaster.bounds.height / 1.5, this.alabaster.bounds.width / 3, this.alabaster.bounds.height / 2);
        /*
        this.wombley_walk_tween = this.tweens.add({
            targets: this.wombley,
            x: this.wombleyXLocation - 120,
            yoyo: true,
            repeat: -1,
            duration: 5000,
            ease: 'Sine.easeInOut',
            onYoyo: () => {
                console.log("w",this.wombley.x)
                this.wombley.flipX = !this.wombley.flipX;
            },
            onRepeat: () => {
                console.log("w",this.wombley.x)
                this.wombley.flipX = !this.wombley.flipX;
            }
        });
        */
        this.wombley_rotate_tween = this.tweens.add({
            targets: this.wombley,
            y: { from: this.wombley.y + 4, to: this.wombley.y - 4 },
            yoyo: true,
            repeat: -1,
            duration: 300,
            ease: 'Linear'
        });
        this.wombley_womble_tween = this.tweens.add({
            targets: this.wombley,
            angle: { from: -4, to: 4 },
            yoyo: true,
            repeat: -1,
            duration: 600,
            ease: 'Linear'
        });
        /*
        this.alabaster_walk_tween = this.tweens.add({
            targets: this.alabaster,
            x: this.alabasterXLocation + 120,
            yoyo: true,
            repeat: -1,
            duration: 4000,
            ease: 'Sine.easeInOut',
            onYoyo: () => {
                console.log("a",this.alabaster.x)
                this.alabaster.flipX = !this.alabaster.flipX;
            },
            onRepeat: () => {
                console.log("a",this.alabaster.x)
                this.alabaster.flipX = !this.alabaster.flipX;
            }
        });
        */
        this.alabaster_rotate_tween = this.tweens.add({
            targets: this.alabaster,
            y: { from: this.alabaster.y + 4, to: this.alabaster.y - 4 },
            angle: { from: -4, to: 4 },
            yoyo: true,
            repeat: -1,
            duration: 300,
            ease: 'Linear'
        });
        this.alabaster_womble_tween = this.tweens.add({
            targets: this.alabaster,
            angle: { from: -4, to: 4 },
            yoyo: true,
            repeat: -1,
            duration: 600,
            ease: 'Linear'
        });
        this.alabaster.nextPos = { x: this.alabaster.x, y: this.alabaster.y };
        this.wombley.nextPos = { x: this.wombley.x, y: this.wombley.y };
        this.setupElfSaySomething(this.wombley, false);
        this.setupElfSaySomething(this.alabaster, true);
        this.alabaster.triggerIncompacitated = (makeThemIncompacitated = false) => {
            //console.log("alab incomp", makeThemIncompacitated)
            if (makeThemIncompacitated) {
                // select randomly from elfGetHitWords
                let randomIndex = Math.floor(Math.random() * elfGetHitWords.length);
                this.alabaster.saySomething(elfGetHitWords[randomIndex], 100);
                this.alabaster.setTint(this.blueTint);
                this.alabaster_rotate_tween.pause();
                this.alabaster_womble_tween.pause();
            } else {
                this.alabaster_rotate_tween.resume();
                this.alabaster_womble_tween.resume();
                this.alabaster.clearTint();
            }
        }
        this.wombley.triggerIncompacitated = (makeThemIncompacitated = false) => {
            //console.log("womb incomp", makeThemIncompacitated)
            if (makeThemIncompacitated) {
                let randomIndex = Math.floor(Math.random() * elfGetHitWords.length);
                this.wombley.saySomething(elfGetHitWords[randomIndex], 100);
                this.wombley.setTint(this.blueTint);
                this.wombley_rotate_tween.pause();
                this.wombley_womble_tween.pause();
            } else {
                this.wombley_rotate_tween.resume();
                this.wombley_womble_tween.resume();
                this.wombley.clearTint();
            }
        }
    }

    setResetDestructibleScenery() {
        if (!this.bgcanvas) {
            this.bgcanvas = this.textures.createCanvas('destructibleScenery', GAME_WIDTH, GAME_HEIGHT);
        }
        if (!this.bgcanvasBackup) {
            this.bgcanvasBackup = this.textures.createCanvas('destructibleSceneryBackup', GAME_WIDTH, GAME_HEIGHT);
        }
        this.bgcanvas.clear();
        this.bgcanvasBackup.clear();

        // Add banners and other scenery
        let numberOfFloorTiles = 6;
        this.createObjectCenteredAtXOnCanvas(this.bgcanvas, 'ground', GAME_WIDTH / 2, GAME_HEIGHT, 1 / numberOfFloorTiles, numberOfFloorTiles);
        this.createObjectCenteredAtXOnCanvas(this.bgcanvasBackup, 'ground', GAME_WIDTH / 2, GAME_HEIGHT, 1 / numberOfFloorTiles, numberOfFloorTiles);

        this.createObjectCenteredAtXOnCanvas(this.bgcanvas, 'ice_wall', GAME_WIDTH / 2, GAME_HEIGHT - 25, 0.35, 1);
        this.createObjectCenteredAtXOnCanvas(this.bgcanvasBackup, 'ice_wall', GAME_WIDTH / 2, GAME_HEIGHT - 25, 0.35, 1);

        this.createObjectCenteredAtXOnCanvas(this.bgcanvas, 'banner_alabaster', this.alabasterXLocation + 40, this.groundOffset, 0.31, 1);
        this.createObjectCenteredAtXOnCanvas(this.bgcanvasBackup, 'banner_alabaster', this.alabasterXLocation + 40, this.groundOffset, 0.31, 1);

        this.createObjectCenteredAtXOnCanvas(this.bgcanvas, 'banner_wombley', this.wombleyXLocation - 24, this.groundOffset, 0.31, 1);
        this.createObjectCenteredAtXOnCanvas(this.bgcanvasBackup, 'banner_wombley', this.wombleyXLocation - 24, this.groundOffset, 0.31, 1);

        this.createObjectCenteredAtXOnCanvas(this.bgcanvas, 'table', this.wombleyXLocation - 24, this.groundOffset + 15, 0.31, 1);
        this.createObjectCenteredAtXOnCanvas(this.bgcanvasBackup, 'table', this.wombleyXLocation - 24, this.groundOffset + 15, 0.31, 1);

        if (!this.bgcanvasImage) {
            this.bgcanvasImage = this.add.image(0, 0, 'destructibleScenery').setOrigin(0, 0);
        }
    }


    createObjectCenteredAtXOnCanvas(dstCanvas, textKey, x, y, scale, numOfTiles = 1) {
        let objCanvas = this.createTiledTexture(textKey, numOfTiles);
        objCanvas = this.scaleDownCanvas(objCanvas, scale);
        let xOffset = x - objCanvas.width / 2;
        let yOffset = y - objCanvas.height;
        this.drawTiledTexture(dstCanvas, objCanvas, xOffset, yOffset);
        if (dstCanvas === this.bgcanvas) {
            this.drawTiledTexture(this.bgcanvasBackup, objCanvas, xOffset, yOffset);
        }
        return objCanvas;
    }


    createTiledTexture(textureKey, tileCount) {
        let originalTexture = this.textures.get(textureKey).getSourceImage();
        let originalWidth = originalTexture.width;
        let originalHeight = originalTexture.height;
        let tiledWidth = originalWidth * tileCount;
        let tiledHeight = originalHeight;
        let ranKey = Math.random().toString(16).slice(2, 10) + Date.now()
        let mirrorCanvas = this.textures.createCanvas(ranKey, tiledWidth, tiledHeight);
        let ctx = mirrorCanvas.context;
        for (let i = 0; i < tileCount; i++) {
            let x = i * originalWidth;
            if (i % 2 === 0) {
                ctx.drawImage(originalTexture, x, 0);
            } else {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(originalTexture, -x - originalWidth, 0);
                ctx.restore();
            }
        }
        mirrorCanvas.refresh();
        return mirrorCanvas;
    }

    scaleDownCanvas(destructibleScenery, scale) {
        let scaledWidth = destructibleScenery.width * scale;
        let scaledHeight = destructibleScenery.height * scale;
        let ranKey = Math.random().toString(16).slice(2, 10) + Date.now()
        let scaledCanvas = this.textures.createCanvas(ranKey, scaledWidth, scaledHeight);
        let ctx = scaledCanvas.context;
        ctx.drawImage(destructibleScenery.canvas, 0, 0, destructibleScenery.width, destructibleScenery.height, 0, 0, scaledWidth, scaledHeight);
        scaledCanvas.refresh();
        return scaledCanvas;
    }

    drawTiledTexture(dstCanvas, sourceCanvas, x, y) {
        dstCanvas.context.drawImage(sourceCanvas.canvas, x, y);
        dstCanvas.refresh();
    }

    setupBackgroundImages() {
        this.add.image(0, 0, 'skybackground').setOrigin(0, 0);
        this.add.image(0, GAME_HEIGHT / 2, 'mountains').setOrigin(0, 0).setScale(0.5);
        this.add.image(0, GAME_HEIGHT / 2.1, 'clouds').setOrigin(0, 0).setScale(0.5);
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2.1, 'clouds').setOrigin(0, 0).setScale(0.5).setFlipX(true);
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'mountains').setOrigin(0, 0).setScale(0.5).setFlipX(true);
        this.add.image(0, GAME_HEIGHT / 2, 'forest').setOrigin(0, 0).setScale(0.5).setFlipX(true);
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'forest').setOrigin(0, 0).setScale(0.5).setFlipX(false);
        let yoffset = 1.35;
        this.add.image(GAME_WIDTH / 2.7, GAME_HEIGHT / 1.23, 'castle_base').setScale(0.4);
        this.add.image(0, GAME_HEIGHT / yoffset, 'houses').setOrigin(0, 0).setScale(0.25).setFlipX(false);
        this.add.image(GAME_WIDTH / 4, GAME_HEIGHT / yoffset, 'houses-alt').setOrigin(0, 0).setScale(0.25).setFlipX(false);
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / yoffset, 'houses-alt').setOrigin(0, 0).setScale(0.25).setFlipX(true);
        this.add.image(GAME_WIDTH / 1.33333333333, GAME_HEIGHT / yoffset, 'houses').setOrigin(0, 0).setScale(0.25).setFlipX(true);
    }
    isOverlapping(points, canvas) {
        let context = canvas.context;
        for (let point of points) {
            if (point.x >= 0 && point.x < canvas.width && point.y >= 0 && point.y < canvas.height) {
                let imageData = context.getImageData(point.x, point.y, 1, 1).data;
                if (imageData[3] !== 0) {
                    return point; // Return the collision point
                }
            }
        }
        return null; // Return null if no collision
    };
    drawTransparentCircle(canvas, x, y, radius) {
        let context = canvas.context;

        // Save the pixels of the circle from the backup canvas before making it transparent
        let backupContext = this.bgcanvasBackup.context;
        let imageData = backupContext.getImageData(x - radius, y - radius, radius * 2, radius * 2);

        // Draw the transparent circle on the main canvas
        context.save();
        context.globalCompositeOperation = 'destination-out'; // Set to draw transparent pixels
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2); // Draw a circle
        context.fill();
        context.restore();
        canvas.refresh();

        if (this.healingTerrain) {
            // After a delay, redraw the saved pixels from the backup canvas
            this.time.delayedCall(this.terrainHealDelay, () => {
                if (this.healingTerrain) {
                    context.putImageData(imageData, x - radius, y - radius);
                    canvas.refresh();
                }
            });
        }
    }

    fireOffParticlesAtLocation(x, y, isWombleys = false) {
        this.add.particles(x, y, isWombleys ? 'particle_yellow' : 'particle', {
            lifespan: 500,
            speed: { min: 50, max: 150 },
            scale: { start: 1.5, end: 0 },
            gravityY: 150,
            emitting: false
        }).setDepth(1).once('complete', (em) => {
            em.destroy()
        }).explode(32);
    }
    lerp(start, end, factor) {
        return (1 - factor) * start + factor * end;
    }
    roundUpToNearestTenth(number) {
        return Math.ceil(number * 10) / 10;
    }
    roundUpToNearestHundreds(number) {
        return Math.ceil(number * 100) / 100;
    }
    animateSnowballHit(collisionPoint, projectile, drawTransCircle = true, dontSendWs = false) {
        if (drawTransCircle) {
            this.drawTransparentCircle(this.bgcanvas, collisionPoint.x, collisionPoint.y, projectile.blastRadius);
        }
        this.fireOffParticlesAtLocation(collisionPoint.x, collisionPoint.y, projectile.isWomb);
        if (!dontSendWs) {
            this.ws.sendMessage({ type: "sbh", id: projectile.id })
        }
        projectile.destroy();
    }
    update(time, delta) {
        let hasMoved = false;
        if (!this.player1.isKo) {
            if (this.player1.isMovingLeft) {
                let futurePosOffset = -(this.playerMoveSpeed * (delta / 1000));
                // Calculate future hitbox points positions
                let futureHitboxPoints = this.player1.hitboxPoints.map(point => ({
                    x: this.player1.x + point.x + futurePosOffset,
                    y: this.player1.y + point.y
                }));
                // Check for collisions
                if (!this.isOverlapping(futureHitboxPoints, this.bgcanvas)) {
                    // Adjust the x position using roundUpToNearestTenth
                    this.player1.x = this.roundUpToNearestTenth(this.player1.x + futurePosOffset); // Move left if no collision detected
                    hasMoved = true;
                }
            } else if (this.player1.isMovingRight) {
                let futurePosOffset = (this.playerMoveSpeed * (delta / 1000));
                // Calculate future hitbox points positions
                let futureHitboxPoints = this.player1.hitboxPoints.map(point => ({
                    x: this.player1.x + point.x + futurePosOffset,
                    y: this.player1.y + point.y
                }));
                // Check for collisions
                if (!this.isOverlapping(futureHitboxPoints, this.bgcanvas)) {
                    // Adjust the x position using roundUpToNearestTenth
                    this.player1.x = this.roundUpToNearestTenth(this.player1.x + futurePosOffset); // Move right if no collision detected
                    hasMoved = true;
                }
            } else if (this.player1.isMovingUp) {
                let futurePosOffset = -(this.playerMoveSpeed * (delta / 1000));
                // Calculate future hitbox points positions
                let futureHitboxPoints = this.player1.hitboxPoints.map(point => ({
                    x: this.player1.x + point.x,
                    y: this.player1.y + point.y + futurePosOffset
                }));
                // Check for collisions
                if (!this.isOverlapping(futureHitboxPoints, this.bgcanvas)) {
                    // Adjust the y position using roundUpToNearestTenth
                    this.player1.y = this.roundUpToNearestTenth(this.player1.y + futurePosOffset); // Move up if no collision detected
                    hasMoved = true;
                } else {
                    console.log("collision detected")
                }
            } else if (this.player1.isMovingDown) {
                let futurePosOffset = (this.playerMoveSpeed * (delta / 1000));
                // Calculate future hitbox points positions
                let futureHitboxPoints = this.player1.hitboxPoints.map(point => ({
                    x: this.player1.x + point.x,
                    y: this.player1.y + point.y + futurePosOffset
                }));
                // Check for collisions
                if (!this.isOverlapping(futureHitboxPoints, this.bgcanvas)) {
                    // Adjust the y position using roundUpToNearestTenth
                    this.player1.y = this.roundUpToNearestTenth(this.player1.y + futurePosOffset); // Move down if no collision detected
                    hasMoved = true;
                } else {
                    console.log("collision detected")
                }
            }
        }
        if (hasMoved) {
            this.arrangePlayer1ArrowsBetweenMouseAndPlayer();
        }
        //this.alabaster.nextPos
        //this.wombley.nextPos
        // use lerp and roundUpToNearestTenth to move the elfcaps

        if (this.roundUpToNearestTenth(this.alabaster.x) !== this.roundUpToNearestTenth(this.alabaster.nextPos.x)) {
            this.alabaster.x = this.lerp(this.alabaster.x, this.alabaster.nextPos.x, 0.05);
            this.alabasterNameText.x = this.alabaster.x;
            this.alabasterNameText.y = this.alabaster.y - (this.alabaster.displayHeight / 2.2);
        }
        if (this.roundUpToNearestTenth(this.wombley.x) !== this.roundUpToNearestTenth(this.wombley.nextPos.x)) {
            this.wombley.x = this.lerp(this.wombley.x, this.wombley.nextPos.x, 0.05);
            this.wombleyNameText.x = this.wombley.x;
            this.wombleyNameText.y = this.wombley.y - (this.alabaster.displayHeight / 2.2);
        }
        /*
        if (this.projectiles && time > this.lastProjectileCollisionDetectionTime + this.projectileCollisionDetectionRate) {
            this.lastProjectileCollisionDetectionTime = time;
            let activeChildren = this.projectiles.getMatching('active', true);
            activeChildren.forEach((projectile) => {
                if (this.time.now - projectile.creationTime > 10000) {
                    projectile.destroy();
                } else if (projectile.x < 0 || projectile.x > this.physics.world.bounds.width || projectile.y > this.physics.world.bounds.height) {
                    projectile.destroy();
                }
            });
        }
        */
        if (this.player2.isJoined) {
            if (!this.player2.isIncapacitated) {
                // Check if player2 has moved in the x direction
                let x = this.roundUpToNearestHundreds(this.player2.x);
                let futureX = this.roundUpToNearestHundreds(this.player2.futureX);
                if (Math.abs(x - futureX) > 0.2) {
                    this.player2.x = this.lerp(x, futureX, 0.1);
                    this.player2.lastTimeMoved = time;
                }

                let y = this.roundUpToNearestHundreds(this.player2.y);
                let futureY = this.roundUpToNearestHundreds(this.player2.futureY);

                // Check if player2 has moved in the y direction
                if (Math.abs(y - futureY) > 0.2) {
                    this.player2.y = this.lerp(y, futureY, 0.1);
                    this.player2.lastTimeMoved = time;
                }

                // Check if player2 has moved within the last second
                if (time - this.player2.lastTimeMoved <= 500) {
                    this.startWalkAnimationTweensIfNotStarted(this.player2);
                } else {
                    this.stopWalkAnimationTweensIfStarted(this.player2, true);
                }
            } else {
                this.stopWalkAnimationTweensIfStarted(this.player2, true);
            }
        }

        if (this.projectiles && time > this.lastProjectileCollisionDetectionTime + this.projectileCollisionDetectionRate) {
            this.lastProjectileCollisionDetectionTime = time;
            let activeChildren = this.projectiles.getMatching('active', true);
            activeChildren.forEach((projectile) => {
                let collisionPoint = null;
                //let hitTarget = null;
                // Draw a line from the last position to the current position
                let lastPos = projectile.lastPos || { x: projectile.x, y: projectile.y };

                // Calculate the difference between the current position and the last position
                let deltaX = projectile.x - lastPos.x;
                let deltaY = projectile.y - lastPos.y;

                // Calculate the future position based on the same trajectory
                // Calculating future position since we are not checking for collisions every frame. This prevents what appears to be delayed collisions. 
                let futurePos = {
                    x: projectile.x + deltaX,
                    y: projectile.y + deltaY
                };

                // Bresenham's line algorithm to iterate over the line between lastPos and the future position
                let x0 = Math.floor(lastPos.x);
                let y0 = Math.floor(lastPos.y);
                let x1 = Math.floor(futurePos.x);
                let y1 = Math.floor(futurePos.y);

                let dx = Math.abs(x1 - x0);
                let dy = Math.abs(y1 - y0);
                let sx = (x0 < x1) ? 1 : -1;
                let sy = (y0 < y1) ? 1 : -1;
                let err = dx - dy;

                while (true) {
                    let xypoint = { x: x0, y: y0 }
                    if (this.isOverlapping([xypoint], this.bgcanvas)) {
                        collisionPoint = xypoint;
                        break;
                    }
                    /*
                     else {
                        let hitT = this.checkIfSnowballPointIsInNonOwnerHitbox(xypoint, projectile.owner, projectile.isWomb);
                        if (hitT) {
                            collisionPoint = xypoint;
                            hitTarget = hitT;
                            break;
                        }
                    }
                        */
                    if (x0 === x1 && y0 === y1) break;
                    let e2 = err * 2;
                    if (e2 > -dy) {
                        err -= dy;
                        x0 += sx;
                    }
                    if (e2 < dx) {
                        err += dx;
                        y0 += sy;
                    }
                }
                if (this.time.now - projectile.creationTime > this.snowballLiveTime) {
                    projectile.destroy();
                } else if (projectile.x < 0 || projectile.x > this.physics.world.bounds.width || projectile.y > this.physics.world.bounds.height) {
                    projectile.destroy();
                    //} else if (hitTarget) {
                    //    this.animateSnowballHit(collisionPoint, projectile, false);
                } else if (collisionPoint) {
                    this.animateSnowballHit(collisionPoint, projectile, true);
                } else {
                    // Custom gravity effect
                    //let centerX = this.physics.world.bounds.width / 2;
                    //let distanceFromCenter = centerX - projectile.x;
                    ///let force = distanceFromCenter * 0.1; // Adjust the multiplier to control the strength of the force
                    //projectile.setVelocityX(projectile.body.velocity.x + force * (delta / 1000));

                    // Rotate the snowball based on its velocity
                    if (projectile.body.velocity.x < 0) {
                        projectile.angle -= 500 * (delta / 1000); // Rotate left
                    } else if (projectile.body.velocity.x > 0) {
                        projectile.angle += 500 * (delta / 1000); // Rotate right
                    }
                    // Update the last position of the projectile
                    projectile.lastPos.x = projectile.x;
                    projectile.lastPos.y = projectile.y;
                }
            });
        }
    }
}