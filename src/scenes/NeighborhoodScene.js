/**
 * NeighborhoodScene.js
 * 2.5D RPG Exploration Scene in Machhli Walo Ka Mohalla.
 * Features 3/4 perspective, dynamic depth sorting by Y-position,
 * player physics movement, NPC dialogue interactions, quest completions, and RPG menus.
 */

import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { HUD } from '../ui/HUD.js';
import { InteractionPrompt } from '../ui/InteractionPrompt.js';
import { NotificationSystem } from '../ui/NotificationSystem.js';
import { DialogueBox } from '../ui/DialogueBox.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { CharacterScreen } from '../ui/CharacterScreen.js';
import { QuestJournal } from '../ui/QuestJournal.js';
import { StoryProgressScreen } from '../ui/StoryProgressScreen.js';
import { InventoryScreen } from '../ui/InventoryScreen.js';
import { RelationshipScreen } from '../ui/RelationshipScreen.js';
import { MapScreen } from '../ui/MapScreen.js';
import { SettingsScreen } from '../ui/SettingsScreen.js';

import { StoryManager } from '../systems/StoryManager.js';
import { StatisticsManager } from '../systems/StatisticsManager.js';
import { QuestManager } from '../systems/QuestManager.js';
import { InventoryManager } from '../systems/InventoryManager.js';
import { RelationshipManager } from '../systems/RelationshipManager.js';
import { SaveManager } from '../systems/SaveManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { UIManager } from '../systems/UIManager.js';

export class NeighborhoodScene extends Phaser.Scene {
  constructor() {
    super('NeighborhoodScene');
  }

  create() {
    const { width, height } = this.scale;

    // Ensure state is synced with Chapter 5 & Adult Age 21
    StoryManager.getInstance().setChapter(5);
    StatisticsManager.getInstance().syncWithAge(21);

    // 1. World Background (1280 x 720)
    this.bg = this.add.image(width / 2, height / 2, 'bg_mohalla_adult');
    this.bg.setDisplaySize(width, height);
    this.bg.setDepth(-1000);

    // 2. Physics World Bounds for 2.5D Street Area
    // The walkable street spans y: 460 .. 680, x: 60 .. 1220
    this.physics.world.setBounds(50, 450, 1180, 240);

    // 3. Environmental Buildings & Props with Depth
    this.createEnvironment();

    // 4. Interactive NPCs
    this.createNPCs();

    // 5. Playable Adult Maajid Player
    this.player = new Player(this, 260, 560);

    // 6. UI Systems & Modals
    this.setupUI();

    // 7. Inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.bindShortcutKeys();

    // 8. Start Exploration Background Music
    AudioManager.getInstance().playMusic('exploration');

    // 9. Camera Fade In & Entrance Location Notification
    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.notifications.showLocation('Machhli Walo Ka Mohalla', 'Hometown of Maajid — Morning Coastal Air');
    });
  }

  createEnvironment() {
    // Maajid's House (Left building)
    this.maajidHouse = this.add.image(220, 360, 'building_maajid_house');
    this.maajidHouse.setDepth(360);

    // Basharat Manzil (Right building, opposite)
    this.basharatHouse = this.add.image(1050, 360, 'building_basharat_house');
    this.basharatHouse.setDepth(360);

    // Mohalla Community Hall (North-Center)
    this.hall = this.add.image(640, 340, 'building_mohalla_hall');
    this.hall.setDepth(340);

    // Machhli Bazaar Stall (Center-Right)
    this.fishStall = this.add.image(860, 480, 'stall_fish_market');
    this.fishStall.setDepth(480);

    // Street Lamps
    this.lamp1 = this.add.image(110, 490, 'prop_street_lamp');
    this.lamp1.setDepth(490);

    this.lamp2 = this.add.image(740, 490, 'prop_street_lamp');
    this.lamp2.setDepth(490);

    // Wooden Bench
    this.bench = this.add.image(380, 520, 'prop_bench');
    this.bench.setDepth(520);
  }

  createNPCs() {
    this.npcs = [];

    // 1. Adult Basharat Bhai (styled after user reference photo)
    // Standing outside Basharat Manzil
    this.basharatNPC = new NPC(
      this,
      980,
      530,
      'npc_basharat_world',
      'Basharat Bhai',
      'Talk to Basharat Bhai [E]',
      () => this.talkToBasharat()
    );
    this.npcs.push(this.basharatNPC);

    // 2. Chacha Iqbal (Mohalla Elder)
    // Standing near the Community Hall
    this.chachaNPC = new NPC(
      this,
      560,
      510,
      'npc_elder_world',
      'Chacha Iqbal',
      'Seek Blessings from Chacha Iqbal [E]',
      () => this.talkToChacha()
    );
    this.npcs.push(this.chachaNPC);

    // 3. Fish Market Vendor / Stall
    this.stallZone = this.add.zone(860, 520, 100, 60);
    this.physics.add.existing(this.stallZone, true);
  }

  setupUI() {
    const ui = UIManager.getInstance();
    ui.registerScene(this);

    this.hud = new HUD(this);
    ui.registerHUD(this.hud);

    this.prompt = new InteractionPrompt(this);
    ui.registerInteractionPrompt(this.prompt);

    this.notifications = new NotificationSystem(this);
    ui.registerNotifications(this.notifications);

    this.dialogueBox = new DialogueBox(this);
    ui.registerDialogueBox(this.dialogueBox);

    // Register all Modal Screens
    this.pauseMenu = new PauseMenu(this);
    ui.registerModal('pause', this.pauseMenu);

    this.characterScreen = new CharacterScreen(this);
    ui.registerModal('character', this.characterScreen);

    this.questJournal = new QuestJournal(this);
    ui.registerModal('journal', this.questJournal);

    this.storyTimeline = new StoryProgressScreen(this);
    ui.registerModal('timeline', this.storyTimeline);

    this.inventoryScreen = new InventoryScreen(this);
    ui.registerModal('inventory', this.inventoryScreen);

    this.relationshipScreen = new RelationshipScreen(this);
    ui.registerModal('relationship', this.relationshipScreen);

    this.mapScreen = new MapScreen(this);
    ui.registerModal('map', this.mapScreen);

    this.settingsScreen = new SettingsScreen(this);
    ui.registerModal('settings', this.settingsScreen);

    // Save modal alias
    ui.registerModal('save', {
      show: () => {
        const slot = 1;
        const success = SaveManager.getInstance().saveToSlot(slot, 'Machhli Walo Ka Mohalla');
        if (success) {
          this.notifications.show('PROGRESS SAVED', `Game saved to Slot ${slot} successfully!`);
        }
        ui.closeCurrentModal();
      },
      hide: () => {}
    });

    // Quest notifications hook
    QuestManager.getInstance().onQuestEvent((ev, quest, extra) => {
      if (ev === 'objective_completed') {
        this.notifications.showQuest(quest.title, `Objective Complete: ${extra}`);
      } else if (ev === 'quest_completed') {
        this.notifications.show('QUEST COMPLETED!', quest.title);
        StatisticsManager.getInstance().addXP(150);
      }
      this.hud.refresh();
    });
  }

  bindShortcutKeys() {
    const ui = UIManager.getInstance();

    this.input.keyboard.on('keydown-C', () => {
      if (!this.dialogueBox.container.visible) ui.toggleModal('character');
    });

    this.input.keyboard.on('keydown-I', () => {
      if (!this.dialogueBox.container.visible) ui.toggleModal('inventory');
    });

    this.input.keyboard.on('keydown-J', () => {
      if (!this.dialogueBox.container.visible) ui.toggleModal('journal');
    });

    this.input.keyboard.on('keydown-M', () => {
      if (!this.dialogueBox.container.visible) ui.toggleModal('map');
    });

    this.input.keyboard.on('keydown-ESC', () => {
      if (ui.isModalOpen()) {
        ui.closeCurrentModal();
      } else if (!this.dialogueBox.container.visible) {
        ui.openModal('pause');
      }
    });
  }

  update(time, delta) {
    const ui = UIManager.getInstance();
    const canMove = !ui.isModalOpen() && !this.dialogueBox.container.visible;

    if (canMove) {
      this.player.update(this.cursors, this.wasd, delta);
    } else {
      this.player.setVelocity(0, 0);
      this.player.anims.stop();
    }

    // Proximity checks for NPCs and objects
    let nearestPrompt = null;
    let nearestAction = null;

    for (const npc of this.npcs) {
      if (npc.isPlayerNear(this.player.x, this.player.y)) {
        nearestPrompt = npc.promptLabel;
        nearestAction = () => npc.interact();
        break;
      }
    }

    // Check fish stall proximity
    if (!nearestPrompt) {
      const distStall = Phaser.Math.Distance.Between(this.player.x, this.player.y, 860, 520);
      if (distStall <= 80) {
        nearestPrompt = 'Inspect Machhli Bazaar [E]';
        nearestAction = () => this.inspectMarket();
      }
    }

    // Check Maajid house door proximity
    if (!nearestPrompt) {
      const distDoor = Phaser.Math.Distance.Between(this.player.x, this.player.y, 220, 500);
      if (distDoor <= 70) {
        nearestPrompt = 'Enter Maajid’s Home [E]';
        nearestAction = () => this.inspectHome();
      }
    }

    if (nearestPrompt && canMove) {
      this.prompt.showPrompt(nearestPrompt);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        nearestAction();
      }
    } else {
      this.prompt.hide();
    }
  }

  // ==========================================
  // INTERACTIONS
  // ==========================================
  talkToBasharat() {
    this.prompt.hide();
    const dialogues = [
      {
        speaker: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_24',
        text: 'Maajid! Good to see you on your feet early. How are the new prescription glasses feeling?'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_21',
        text: 'Much better, Basharat Bhai. The blurry edges are gone. I can see the sea horizon clearly from across the street.'
      },
      {
        speaker: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_24',
        text: 'That’s wonderful. A clear vision for a clear future. Never forget how far you’ve come from those reckless childhood days.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_21',
        text: 'Only because you showed me that true strength lies in patience and education, Basharat Bhai.'
      },
      {
        speaker: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_24',
        text: 'You did the hard work yourself, Maajid. Take a stroll down the street, say salam to Chacha Iqbal, and see if the morning catch has arrived at the market.'
      }
    ];

    let dIdx = 0;
    const playNext = () => {
      if (dIdx < dialogues.length) {
        const d = dialogues[dIdx++];
        this.dialogueBox.showDialogue(d, playNext);
      } else {
        this.dialogueBox.hide();
        // Complete quest objective
        QuestManager.getInstance().completeObjective('quest_ch5_adult_beginnings', 'talk_basharat');
        this.hud.refresh();
      }
    };
    playNext();
  }

  talkToChacha() {
    this.prompt.hide();
    const dialogues = [
      {
        speaker: 'Chacha Iqbal',
        portrait: 'portrait_chacha_iqbal',
        text: 'Jeete raho, Maajid beta! May Allah grant you health and endless peace.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_21',
        text: 'Salam, Chacha Iqbal. How is your health today?'
      },
      {
        speaker: 'Chacha Iqbal',
        portrait: 'portrait_chacha_iqbal',
        text: 'Alhamdulillah, every sunrise in Machhli Mohalla is a gift. Seeing young men like you and Basharat stand with dignity fills my heart with joy.'
      }
    ];

    let dIdx = 0;
    const playNext = () => {
      if (dIdx < dialogues.length) {
        const d = dialogues[dIdx++];
        this.dialogueBox.showDialogue(d, playNext);
      } else {
        this.dialogueBox.hide();
        QuestManager.getInstance().completeObjective('quest_ch5_adult_beginnings', 'greet_chacha');
        this.hud.refresh();
      }
    };
    playNext();
  }

  inspectMarket() {
    this.prompt.hide();
    const dialogues = [
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Fresh silver pomfret, kingfish, and prawns are neatly displayed over beds of crushed ice. The morning market bustle is in full swing.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_21',
        text: 'The fishermen arrived early today. The mohalla will eat well tonight.'
      }
    ];

    let dIdx = 0;
    const playNext = () => {
      if (dIdx < dialogues.length) {
        const d = dialogues[dIdx++];
        this.dialogueBox.showDialogue(d, playNext);
      } else {
        this.dialogueBox.hide();
        QuestManager.getInstance().completeObjective('quest_ch5_adult_beginnings', 'check_market');
        this.hud.refresh();
      }
    };
    playNext();
  }

  inspectHome() {
    this.prompt.hide();
    const dialogues = [
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_21',
        text: 'My childhood home. Where I used to nurse bruises from street fights... and where I studied late into the night.'
      }
    ];
    this.dialogueBox.showDialogue(dialogues[0], () => {
      this.dialogueBox.hide();
    });
  }
}
