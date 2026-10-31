/**
 * AssetGenerator.js
 * Generates all game textures programmatically into Phaser's TextureManager.
 * Ensures 100% reliable rendering with zero broken asset paths.
 */

export class AssetGenerator {
  static generateAll(scene) {
    this.generateBackgrounds(scene);
    this.generatePortraits(scene);
    this.generateWorldSprites(scene);
    this.generateUIElements(scene);
    this.generateIcons(scene);
  }

  // ==========================================
  // BACKGROUNDS (1280 x 720)
  // ==========================================
  static generateBackgrounds(scene) {
    // 1. Title Screen Background: Coastal Machhli Walo Ka Mohalla at golden hour
    this.createTexture(scene, 'bg_title', 1280, 720, (ctx) => {
      // Sky gradient: Twilight to golden amber
      const sky = ctx.createLinearGradient(0, 0, 0, 720);
      sky.addColorStop(0, '#0f172a');
      sky.addColorStop(0.35, '#1e293b');
      sky.addColorStop(0.65, '#78350f');
      sky.addColorStop(0.85, '#d97706');
      sky.addColorStop(1, '#f59e0b');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 1280, 720);

      // Distant sea horizon
      const sea = ctx.createLinearGradient(0, 480, 0, 720);
      sea.addColorStop(0, '#1e3a8a');
      sea.addColorStop(0.4, '#172554');
      sea.addColorStop(1, '#090d16');
      ctx.fillStyle = sea;
      ctx.fillRect(0, 480, 1280, 240);

      // Gentle sea waves highlights
      ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
      for (let i = 0; i < 20; i++) {
        const y = 490 + i * 11;
        const w = 40 + (i * 25);
        ctx.fillRect(640 - w / 2 + Math.sin(i) * 50, y, w, 2);
      }

      // Distant fishing boats on water
      ctx.fillStyle = '#0f172a';
      [280, 850, 1020].forEach((bx, idx) => {
        ctx.beginPath();
        ctx.ellipse(bx, 505 + idx * 6, 25, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(bx - 1, 490 + idx * 6, 2, 15);
      });

      // Mohalla rooftop silhouettes (Layer 1 - deep background)
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(0, 720);
      ctx.lineTo(0, 440);
      ctx.lineTo(120, 430);
      ctx.lineTo(120, 410);
      ctx.lineTo(240, 410);
      ctx.lineTo(360, 460);
      ctx.lineTo(480, 450);
      ctx.lineTo(580, 470);
      ctx.lineTo(760, 440);
      ctx.lineTo(920, 420);
      ctx.lineTo(1080, 450);
      ctx.lineTo(1280, 430);
      ctx.lineTo(1280, 720);
      ctx.closePath();
      ctx.fill();

      // Mohalla buildings (Layer 2 - foreground silhouettes)
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.moveTo(0, 720);
      ctx.lineTo(0, 390);
      ctx.lineTo(180, 370);
      ctx.lineTo(220, 400);
      ctx.lineTo(320, 400);
      ctx.lineTo(440, 480);
      ctx.lineTo(520, 520);
      ctx.lineTo(780, 520);
      ctx.lineTo(880, 460);
      ctx.lineTo(1050, 380);
      ctx.lineTo(1280, 360);
      ctx.lineTo(1280, 720);
      ctx.closePath();
      ctx.fill();

      // Warm glowing windows in houses
      ctx.fillStyle = '#fef08a';
      const windows = [
        [60, 420], [130, 430], [80, 490], [140, 490],
        [940, 410], [1000, 430], [1120, 400], [1200, 420]
      ];
      windows.forEach(([wx, wy]) => {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.fillRect(wx, wy, 16, 22);
      });
      ctx.shadowBlur = 0;

      // Clotheslines and street cables
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(180, 380);
      ctx.quadraticCurveTo(550, 450, 900, 440);
      ctx.stroke();

      // Atmospheric vignette
      const vig = ctx.createRadialGradient(640, 360, 200, 640, 360, 750);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, 1280, 720);
    });

    // 2. Childhood Mohalla (Chapter 1)
    this.createTexture(scene, 'bg_mohalla_childhood', 1280, 720, (ctx) => {
      // Sunny dusty Indian coastal mohalla afternoon
      const sky = ctx.createLinearGradient(0, 0, 0, 500);
      sky.addColorStop(0, '#60a5fa');
      sky.addColorStop(0.7, '#bae6fd');
      sky.addColorStop(1, '#fef08a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 1280, 720);

      // Terracotta and brick mohalla houses
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 220, 380, 400);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 200, 400, 25);

      // Right house
      ctx.fillStyle = '#9a3412';
      ctx.fillRect(860, 200, 420, 420);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(840, 180, 440, 25);

      // Windows and wooden carved balconies
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(80, 270, 70, 90);
      ctx.fillRect(220, 270, 70, 90);
      ctx.fillRect(940, 250, 80, 100);
      ctx.fillRect(1100, 250, 80, 100);

      // Balcony grilles
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.strokeRect(75, 330, 80, 35);
      ctx.strokeRect(215, 330, 80, 35);

      // Distant houses in alleyway center
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(440, 320, 180, 200);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(630, 340, 160, 180);

      // Mohalla stone street
      const street = ctx.createLinearGradient(0, 480, 0, 720);
      street.addColorStop(0, '#64748b');
      street.addColorStop(0.5, '#475569');
      street.addColorStop(1, '#334155');
      ctx.fillStyle = street;
      ctx.fillRect(0, 480, 1280, 240);

      // Cobblestone / paving lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 500 + i * 15);
        ctx.lineTo(1280, 500 + i * 15);
        ctx.stroke();
      }

      // Fishing nets draped over wall (Machhli Walo Ka Mohalla touch)
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)';
      ctx.lineWidth = 1.5;
      for (let x = 80; x < 320; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 400);
        ctx.lineTo(x + 20, 470);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 20, 400);
        ctx.lineTo(x, 470);
        ctx.stroke();
      }

      // Decorative hanging signs & street lamps
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(390, 370, 8, 120);
      ctx.beginPath();
      ctx.arc(394, 370, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Muharram Night (Chapter 2)
    this.createTexture(scene, 'bg_muharram', 1280, 720, (ctx) => {
      // Midnight dark sky
      const sky = ctx.createLinearGradient(0, 0, 0, 720);
      sky.addColorStop(0, '#020617');
      sky.addColorStop(0.6, '#0f172a');
      sky.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 1280, 720);

      // Glowing torches / lamps along mohalla
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 240, 350, 400);
      ctx.fillRect(910, 220, 370, 420);

      // Dark flags / Alam banners
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.moveTo(280, 180);
      ctx.lineTo(340, 210);
      ctx.lineTo(280, 240);
      ctx.closePath();
      ctx.fill();

      // Torches (Mashal) with ambient glow
      const torches = [180, 380, 890, 1100];
      torches.forEach(tx => {
        const radGlow = ctx.createRadialGradient(tx, 410, 5, tx, 410, 90);
        radGlow.addColorStop(0, 'rgba(249, 115, 22, 0.9)');
        radGlow.addColorStop(0.5, 'rgba(234, 88, 12, 0.3)');
        radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGlow;
        ctx.fillRect(tx - 90, 320, 180, 180);

        // Torch flame
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(tx, 405, 8, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#451a03';
        ctx.fillRect(tx - 3, 418, 6, 45);
      });

      // Crowd silhouettes in background
      ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
      for (let x = 100; x < 1200; x += 35) {
        ctx.beginPath();
        ctx.arc(x, 480 + Math.sin(x) * 10, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - 18, 490, 36, 60);
      }

      // Ground with firelight reflections
      const gnd = ctx.createLinearGradient(0, 530, 0, 720);
      gnd.addColorStop(0, '#1c1917');
      gnd.addColorStop(0.5, '#292524');
      gnd.addColorStop(1, '#0c0a09');
      ctx.fillStyle = gnd;
      ctx.fillRect(0, 530, 1280, 190);
    });

    // 4. Change of Heart (Chapter 3)
    this.createTexture(scene, 'bg_change_heart', 1280, 720, (ctx) => {
      // Quiet peaceful night sky with full moon and sea view
      const sky = ctx.createLinearGradient(0, 0, 0, 720);
      sky.addColorStop(0, '#020617');
      sky.addColorStop(0.5, '#0f172a');
      sky.addColorStop(0.85, '#1e293b');
      sky.addColorStop(1, '#0f172a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 1280, 720);

      // Moon
      const moonGlow = ctx.createRadialGradient(920, 160, 10, 920, 160, 120);
      moonGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
      moonGlow.addColorStop(0.3, 'rgba(224, 231, 255, 0.5)');
      moonGlow.addColorStop(1, 'rgba(224, 231, 255, 0)');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(800, 40, 240, 240);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(920, 160, 36, 0, Math.PI * 2);
      ctx.fill();

      // Calm sea horizon
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 420, 1280, 140);
      // Moonlight reflection on water
      const moonRef = ctx.createLinearGradient(920, 420, 920, 560);
      moonRef.addColorStop(0, 'rgba(224, 231, 255, 0.4)');
      moonRef.addColorStop(1, 'rgba(224, 231, 255, 0.05)');
      ctx.fillStyle = moonRef;
      ctx.fillRect(880, 420, 80, 140);

      // Rooftop terrace parapet where Maajid sits reflecting
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 550, 1280, 170);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 530, 1280, 30);
    });

    // 5. Tuition Room (Chapter 4)
    this.createTexture(scene, 'bg_tuition_room', 1280, 720, (ctx) => {
      // Warm domestic study room inside Basharat Bhai's house
      const wall = ctx.createLinearGradient(0, 0, 0, 560);
      wall.addColorStop(0, '#fef3c7');
      wall.addColorStop(0.6, '#fde68a');
      wall.addColorStop(1, '#f59e0b');
      ctx.fillStyle = wall;
      ctx.fillRect(0, 0, 1280, 560);

      // Blackboard on wall with English & Math notes
      ctx.fillStyle = '#14532d';
      ctx.fillRect(360, 70, 560, 260);
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#78350f';
      ctx.strokeRect(360, 70, 560, 260);

      // Chalk writings on blackboard
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '20px monospace';
      ctx.fillText('ENGLISH & MATHEMATICS', 480, 120);
      ctx.font = '16px monospace';
      ctx.fillText('1. "Knowledge is greater than strength."', 410, 160);
      ctx.fillText('2. Area of Circle = π · r²', 410, 195);
      ctx.fillText('3. Solve: 3x + 15 = 45  =>  x = ?', 410, 230);
      ctx.fillText('Hard work + Patience = Respect', 410, 270);

      // Bookshelves on the left
      ctx.fillStyle = '#78350f';
      ctx.fillRect(60, 100, 220, 420);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(60, 200, 220, 14);
      ctx.fillRect(60, 310, 220, 14);
      ctx.fillRect(60, 420, 220, 14);

      // Colourful books
      const bookColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      for (let shelf = 0; shelf < 3; shelf++) {
        const sy = 120 + shelf * 110;
        for (let b = 0; b < 9; b++) {
          ctx.fillStyle = bookColors[(b + shelf) % bookColors.length];
          ctx.fillRect(75 + b * 22, sy + (b % 3) * 6, 18, 70 - (b % 3) * 6);
        }
      }

      // Wooden floor
      const floor = ctx.createLinearGradient(0, 560, 0, 720);
      floor.addColorStop(0, '#92400e');
      floor.addColorStop(1, '#451a03');
      ctx.fillStyle = floor;
      ctx.fillRect(0, 560, 1280, 160);

      // Study desk in foreground
      ctx.fillStyle = '#78350f';
      ctx.fillRect(320, 500, 640, 180);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(300, 480, 680, 30);

      // Open notebook & pen on desk
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(520, 490, 80, 55);
      ctx.fillRect(605, 490, 80, 55);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(695, 495, 40, 6);
    });

    // 6. Adult Mohalla (Chapter 5 & 2.5D RPG World)
    this.createTexture(scene, 'bg_mohalla_adult', 1280, 720, (ctx) => {
      // Clear morning coastal sky
      const sky = ctx.createLinearGradient(0, 0, 0, 400);
      sky.addColorStop(0, '#38bdf8');
      sky.addColorStop(0.7, '#7dd3fc');
      sky.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 1280, 720);

      // Ocean glimpse in the background
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 240, 1280, 80);

      // Distant palm trees & town skyline
      ctx.fillStyle = '#065f46';
      for (let p = 50; p < 1250; p += 160) {
        ctx.beginPath();
        ctx.arc(p, 230, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(p - 3, 230, 6, 40);
        ctx.fillStyle = '#065f46';
      }

      // Adult Mohalla architecture: Clean painted houses, shops, street lamp
      // Left building (Maajid's home side)
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, 190, 420, 340);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, 170, 440, 24);
      // Windows
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(70, 240, 65, 80);
      ctx.fillRect(220, 240, 65, 80);
      // Arch door
      ctx.beginPath();
      ctx.arc(170, 430, 45, Math.PI, 0);
      ctx.lineTo(215, 530);
      ctx.lineTo(125, 530);
      ctx.closePath();
      ctx.fillStyle = '#451a03';
      ctx.fill();

      // Right building (Basharat Bhai's House opposite)
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(840, 170, 440, 360);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(820, 150, 460, 24);
      // Nameplate: "BASHARAT MANZIL"
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(920, 310, 140, 30);
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('BASHARAT MANZIL', 932, 330);

      // Paved town ground
      const ground = ctx.createLinearGradient(0, 480, 0, 720);
      ground.addColorStop(0, '#94a3b8');
      ground.addColorStop(0.4, '#64748b');
      ground.addColorStop(1, '#475569');
      ctx.fillStyle = ground;
      ctx.fillRect(0, 480, 1280, 240);

      // Pavers texture
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for (let y = 500; y < 720; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1280, y);
        ctx.stroke();
      }
    });
  }

  // ==========================================
  // CHARACTER PORTRAITS (320 x 420)
  // ==========================================
  static generatePortraits(scene) {
    // 1. Maajid Age 8: Brown skin, bald, short, skinny, fierce/intimidating expression
    this.createTexture(scene, 'portrait_maajid_age_8', 320, 420, (ctx) => {
      this.drawPortraitBackground(ctx, '#451a03', '#1e1b4b');

      // Skinny neck & shoulders
      ctx.fillStyle = '#8d5b4c';
      ctx.fillRect(145, 270, 30, 50);

      // White vest / undershirt
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(100, 380);
      ctx.lineTo(130, 290);
      ctx.lineTo(190, 290);
      ctx.lineTo(220, 380);
      ctx.closePath();
      ctx.fill();

      // Head: Bald, child proportions, slight angular jaw
      ctx.fillStyle = '#a26d5b';
      ctx.beginPath();
      ctx.ellipse(160, 190, 68, 76, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.beginPath();
      ctx.ellipse(90, 195, 12, 18, 0, 0, Math.PI * 2);
      ctx.ellipse(230, 195, 12, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fierce intimidating child expression: Slanted sharp eyebrows
      ctx.strokeStyle = '#291811';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(125, 175);
      ctx.lineTo(152, 184);
      ctx.moveTo(195, 175);
      ctx.lineTo(168, 184);
      ctx.stroke();

      // Sharp, intense dark eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(138, 192, 11, 7, -0.1, 0, Math.PI * 2);
      ctx.ellipse(182, 192, 11, 7, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(139, 192, 5, 0, Math.PI * 2);
      ctx.arc(181, 192, 5, 0, Math.PI * 2);
      ctx.fill();

      // Small child nose
      ctx.strokeStyle = '#6e3c2f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(160, 190);
      ctx.lineTo(157, 215);
      ctx.lineTo(164, 215);
      ctx.stroke();

      // Firm, grim mouth
      ctx.beginPath();
      ctx.moveTo(146, 236);
      ctx.lineTo(174, 236);
      ctx.stroke();
    });

    // 2. Maajid Age 8 Injured (After Muharram fight)
    this.createTexture(scene, 'portrait_maajid_age_8_injured', 320, 420, (ctx) => {
      // Base is same as age 8
      if (scene.textures.exists('portrait_maajid_age_8')) {
        const base = scene.textures.get('portrait_maajid_age_8').getSourceImage();
        if (base) ctx.drawImage(base, 0, 0, 320, 420);
      }

      // Bruise on cheek
      ctx.fillStyle = 'rgba(159, 18, 57, 0.6)';
      ctx.beginPath();
      ctx.ellipse(185, 215, 18, 12, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // White bandage on forehead
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(115, 140, 40, 16);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(115, 140, 40, 16);

      // Small cut on lip
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(166, 234);
      ctx.lineTo(166, 240);
      ctx.stroke();
    });

    // 3. Maajid Age 12: Brown skin, short hair, skinny schoolboy, innocent curious face
    this.createTexture(scene, 'portrait_maajid_age_12', 320, 420, (ctx) => {
      this.drawPortraitBackground(ctx, '#064e3b', '#0f172a');

      // School uniform collar (blue)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(90, 420);
      ctx.lineTo(120, 300);
      ctx.lineTo(200, 300);
      ctx.lineTo(230, 420);
      ctx.closePath();
      ctx.fill();

      // White collar tips
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(130, 300);
      ctx.lineTo(160, 335);
      ctx.lineTo(145, 300);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(190, 300);
      ctx.lineTo(160, 335);
      ctx.lineTo(175, 300);
      ctx.fill();

      // Neck
      ctx.fillStyle = '#9a6755';
      ctx.fillRect(144, 270, 32, 40);

      // Head
      ctx.fillStyle = '#b47b68';
      ctx.beginPath();
      ctx.ellipse(160, 195, 64, 74, 0, 0, Math.PI * 2);
      ctx.fill();

      // Neat short hair
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(160, 165, 68, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();

      // Soft boyish eyebrows
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(138, 178, 14, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(182, 178, 14, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Innocent curious eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(138, 194, 10, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(182, 194, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(138, 194, 5, 0, Math.PI * 2);
      ctx.arc(182, 194, 5, 0, Math.PI * 2);
      ctx.fill();

      // Gentle smile
      ctx.strokeStyle = '#572d1f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(160, 235, 14, 0.2, Math.PI - 0.2);
      ctx.stroke();
    });

    // 4. Maajid Age 21: Adult, Brown skin, styled hair, clean shaven, square glasses, handsome
    this.createTexture(scene, 'portrait_maajid_age_21', 320, 420, (ctx) => {
      this.drawPortraitBackground(ctx, '#1e293b', '#090d16');

      // Crisp linen shirt (tan / cream)
      ctx.fillStyle = '#e2d9cc';
      ctx.beginPath();
      ctx.moveTo(60, 420);
      ctx.lineTo(110, 290);
      ctx.lineTo(210, 290);
      ctx.lineTo(260, 420);
      ctx.closePath();
      ctx.fill();

      // Open collar
      ctx.fillStyle = '#a67c6d';
      ctx.beginPath();
      ctx.moveTo(140, 290);
      ctx.lineTo(160, 330);
      ctx.lineTo(180, 290);
      ctx.closePath();
      ctx.fill();

      // Mature neck
      ctx.fillStyle = '#a67c6d';
      ctx.fillRect(142, 250, 36, 45);

      // Defined adult jawline
      ctx.fillStyle = '#ba8d7e';
      ctx.beginPath();
      ctx.moveTo(100, 170);
      ctx.lineTo(105, 230);
      ctx.lineTo(145, 270);
      ctx.lineTo(175, 270);
      ctx.lineTo(215, 230);
      ctx.lineTo(220, 170);
      ctx.closePath();
      ctx.fill();

      // Head top
      ctx.beginPath();
      ctx.ellipse(160, 175, 62, 70, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stylish medium-length swept hair
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(90, 170);
      ctx.quadraticCurveTo(110, 95, 180, 100);
      ctx.quadraticCurveTo(240, 105, 230, 180);
      ctx.quadraticCurveTo(210, 120, 150, 120);
      ctx.quadraticCurveTo(110, 130, 90, 170);
      ctx.fill();

      // Ears
      ctx.fillStyle = '#ba8d7e';
      ctx.beginPath();
      ctx.ellipse(98, 195, 10, 18, 0, 0, Math.PI * 2);
      ctx.ellipse(222, 195, 10, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Well-groomed eyebrows
      ctx.strokeStyle = '#262626';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(120, 174);
      ctx.lineTo(148, 172);
      ctx.moveTo(172, 172);
      ctx.lineTo(200, 174);
      ctx.stroke();

      // Mature eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(135, 188, 11, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(185, 188, 11, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.arc(135, 188, 5, 0, Math.PI * 2);
      ctx.arc(185, 188, 5, 0, Math.PI * 2);
      ctx.fill();

      // Square transparent prescription glasses (prompt specified!)
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(118, 176, 35, 25);
      ctx.strokeRect(167, 176, 35, 25);
      // Bridge
      ctx.beginPath();
      ctx.moveTo(153, 185);
      ctx.lineTo(167, 185);
      // Arms
      ctx.moveTo(118, 182);
      ctx.lineTo(100, 180);
      ctx.moveTo(202, 182);
      ctx.lineTo(220, 180);
      ctx.stroke();

      // Glass shine glare
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(122, 196);
      ctx.lineTo(132, 180);
      ctx.moveTo(172, 196);
      ctx.lineTo(182, 180);
      ctx.stroke();

      // Calm confident smile
      ctx.strokeStyle = '#603123';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(160, 238, 15, 0.2, Math.PI - 0.2);
      ctx.stroke();
    });

    // 5. Adult Basharat (Age 24): Fair skin, Man-bun, light beard/stubble, white shirt, coastal background
    // (Faithfully adapted from user reference photograph!)
    this.createTexture(scene, 'portrait_basharat_age_24', 320, 420, (ctx) => {
      // Coastal atmosphere background (matching photo with sea & sky)
      const bg = ctx.createLinearGradient(0, 0, 0, 420);
      bg.addColorStop(0, '#64748b');
      bg.addColorStop(0.5, '#94a3b8');
      bg.addColorStop(0.8, '#cbd5e1');
      bg.addColorStop(1, '#475569');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 320, 420);

      // Open crisp white shirt with collar
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(50, 420);
      ctx.lineTo(100, 280);
      ctx.lineTo(220, 280);
      ctx.lineTo(270, 420);
      ctx.closePath();
      ctx.fill();

      // Collar flaps
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(100, 280);
      ctx.lineTo(135, 320);
      ctx.lineTo(145, 280);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(220, 280);
      ctx.lineTo(185, 320);
      ctx.lineTo(175, 280);
      ctx.fill();

      // Chest opening (masculine open collar from photo)
      ctx.fillStyle = '#f2d5c2';
      ctx.beginPath();
      ctx.moveTo(145, 280);
      ctx.lineTo(160, 340);
      ctx.lineTo(175, 280);
      ctx.closePath();
      ctx.fill();

      // Fair toned muscular neck
      ctx.fillStyle = '#f2d5c2';
      ctx.fillRect(140, 240, 40, 45);

      // Strong defined handsome jawline
      ctx.fillStyle = '#fcd9c5';
      ctx.beginPath();
      ctx.moveTo(95, 170);
      ctx.lineTo(102, 230);
      ctx.lineTo(142, 268);
      ctx.lineTo(178, 268);
      ctx.lineTo(218, 230);
      ctx.lineTo(225, 170);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(160, 175, 65, 72, 0, 0, Math.PI * 2);
      ctx.fill();

      // Man-bun hairstyle & wavy textured dark hair
      ctx.fillStyle = '#1e1b18';
      // Main hair mass
      ctx.beginPath();
      ctx.arc(160, 160, 70, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
      // Bun at back-top
      ctx.beginPath();
      ctx.arc(160, 85, 22, 0, Math.PI * 2);
      ctx.fill();
      // Side hair sweeps
      ctx.fillRect(88, 150, 18, 40);
      ctx.fillRect(214, 150, 18, 40);

      // Light stylish beard & moustache (from reference photo)
      ctx.fillStyle = 'rgba(30, 27, 24, 0.45)';
      // Moustache
      ctx.beginPath();
      ctx.ellipse(160, 228, 22, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Jawline stubble & chin beard
      ctx.beginPath();
      ctx.moveTo(108, 220);
      ctx.lineTo(142, 266);
      ctx.lineTo(178, 266);
      ctx.lineTo(212, 220);
      ctx.lineTo(205, 238);
      ctx.lineTo(176, 269);
      ctx.lineTo(144, 269);
      ctx.lineTo(115, 238);
      ctx.closePath();
      ctx.fill();

      // Stylish sunglasses resting / dark charismatic eyes
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.ellipse(135, 188, 12, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(185, 188, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(133, 186, 2.5, 0, Math.PI * 2);
      ctx.arc(183, 186, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Friendly elder brother smile
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(160, 238, 14, 0.2, Math.PI - 0.2);
      ctx.stroke();
    });

    // 6. Basharat Age 15 (Teenager tuition teacher)
    this.createTexture(scene, 'portrait_basharat_age_15', 320, 420, (ctx) => {
      this.drawPortraitBackground(ctx, '#1e3a8a', '#0f172a');

      // Simple neat cotton shirt
      ctx.fillStyle = '#bfdbfe';
      ctx.beginPath();
      ctx.moveTo(70, 420);
      ctx.lineTo(115, 290);
      ctx.lineTo(205, 290);
      ctx.lineTo(250, 420);
      ctx.closePath();
      ctx.fill();

      // Slender neck
      ctx.fillStyle = '#f2d5c2';
      ctx.fillRect(144, 255, 32, 40);

      // Clean-shaven teenage face
      ctx.fillStyle = '#fcd9c5';
      ctx.beginPath();
      ctx.ellipse(160, 185, 60, 72, 0, 0, Math.PI * 2);
      ctx.fill();

      // Combed dark teenage hair
      ctx.fillStyle = '#1e1b18';
      ctx.beginPath();
      ctx.arc(160, 160, 64, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();

      // Polite studious eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(136, 188, 10, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(184, 188, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(136, 188, 5, 0, Math.PI * 2);
      ctx.arc(184, 188, 5, 0, Math.PI * 2);
      ctx.fill();

      // Gentle mentor smile
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(160, 228, 14, 0.2, Math.PI - 0.2);
      ctx.stroke();
    });

    // 7. Firoz Age 20 (The rough neighbourhood bully)
    this.createTexture(scene, 'portrait_firoz_age_20', 320, 420, (ctx) => {
      this.drawPortraitBackground(ctx, '#7f1d1d', '#18181b');

      // Muscular shoulders in black sleeveless vest
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.moveTo(50, 420);
      ctx.lineTo(100, 280);
      ctx.lineTo(220, 280);
      ctx.lineTo(270, 420);
      ctx.closePath();
      ctx.fill();

      // Fair skin tone, broad neck
      ctx.fillStyle = '#f5d0b8';
      ctx.fillRect(135, 240, 50, 45);

      // Heavy jaw, arrogant tilt
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.ellipse(160, 175, 68, 74, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wavy unruly hair
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.arc(160, 150, 74, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();

      // Arrogant scowl eyebrows
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(115, 168);
      ctx.lineTo(148, 178);
      ctx.moveTo(205, 168);
      ctx.lineTo(172, 178);
      ctx.stroke();

      // Harsh mocking eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(134, 188, 11, 6, 0.1, 0, Math.PI * 2);
      ctx.ellipse(186, 188, 11, 6, -0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.arc(134, 188, 5, 0, Math.PI * 2);
      ctx.arc(186, 188, 5, 0, Math.PI * 2);
      ctx.fill();

      // Villainous smirk
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(140, 235);
      ctx.quadraticCurveTo(165, 238, 185, 226);
      ctx.stroke();
    });

    // 8. Firoz's Younger Brother (Age 18)
    this.createTexture(scene, 'portrait_firoz_brother_age_18', 320, 420, (ctx) => {
      this.drawPortraitBackground(ctx, '#713f12', '#18181b');

      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(60, 420);
      ctx.lineTo(110, 290);
      ctx.lineTo(210, 290);
      ctx.lineTo(260, 420);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f5d0b8';
      ctx.fillRect(142, 250, 36, 45);

      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.ellipse(160, 180, 62, 70, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.arc(160, 155, 66, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();

      // Looking nervous / aggressive follower
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(136, 186, 9, 6, 0, 0, Math.PI * 2);
      ctx.ellipse(184, 186, 9, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(136, 186, 4, 0, Math.PI * 2);
      ctx.arc(184, 186, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // 9. Mohalla Elder: Chacha Iqbal
    this.createTexture(scene, 'portrait_chacha_iqbal', 320, 420, (ctx) => {
      this.drawPortraitBackground(ctx, '#14532d', '#0f172a');
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(80, 290, 160, 130);

      ctx.fillStyle = '#ba8d7e';
      ctx.beginPath();
      ctx.ellipse(160, 185, 62, 72, 0, 0, Math.PI * 2);
      ctx.fill();

      // White beard
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(160, 230, 45, 0, Math.PI);
      ctx.fill();

      // Traditional cap
      ctx.fillStyle = '#15803d';
      ctx.fillRect(115, 110, 90, 40);

      // Wise kind eyes
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(136, 185, 8, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(184, 185, 8, 0.2, Math.PI - 0.2);
      ctx.stroke();
    });
  }

  static drawPortraitBackground(ctx, col1, col2) {
    const rad = ctx.createRadialGradient(160, 210, 30, 160, 210, 220);
    rad.addColorStop(0, col1);
    rad.addColorStop(1, col2);
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 320, 420);

    // Frame border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 316, 416);
  }

  // ==========================================
  // 2.5D RPG WORLD SPRITES & OBJECTS
  // ==========================================
  static generateWorldSprites(scene) {
    // Player Walk Spritesheet: 4 directions (Down, Left, Right, Up), 3 frames each = 12 frames
    // Frame size: 48 x 64 px => Sheet: 144 x 256 px
    this.createTexture(scene, 'player_sprite_sheet', 144, 256, (ctx) => {
      const directions = ['down', 'left', 'right', 'up'];
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          const x = col * 48;
          const y = row * 64;
          const legOffset = (col === 1 ? -3 : (col === 2 ? 3 : 0));
          const dir = directions[row];

          // Character shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.beginPath();
          ctx.ellipse(x + 24, y + 60, 14, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Legs / trousers (linen beige)
          ctx.fillStyle = '#d4c5b3';
          if (dir === 'left' || dir === 'right') {
            ctx.fillRect(x + 20 + legOffset, y + 42, 8, 18);
          } else {
            ctx.fillRect(x + 16, y + 42, 6, 18 + legOffset);
            ctx.fillRect(x + 26, y + 42, 6, 18 - legOffset);
          }

          // Shoes (white sneakers from reference)
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(x + 14, y + 58 + legOffset, 8, 4);
          ctx.fillRect(x + 26, y + 58 - legOffset, 8, 4);

          // Torso: Crisp shirt
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(x + 16, y + 26, 16, 18);

          // Head (Maajid brown skin)
          ctx.fillStyle = '#ba8d7e';
          ctx.beginPath();
          ctx.arc(x + 24, y + 16, 9, 0, Math.PI * 2);
          ctx.fill();

          // Hair (swept dark)
          ctx.fillStyle = '#1c1917';
          if (dir === 'up') {
            ctx.beginPath();
            ctx.arc(x + 24, y + 15, 9, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(x + 24, y + 13, 9, Math.PI * 0.8, Math.PI * 2.2);
            ctx.fill();
          }

          // Square glasses visible on front and side
          if (dir === 'down') {
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 18, y + 14, 5, 4);
            ctx.strokeRect(x + 25, y + 14, 5, 4);
          } else if (dir === 'left') {
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 18, y + 14, 5, 4);
          } else if (dir === 'right') {
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 25, y + 14, 5, 4);
          }
        }
      }
    });

    // Adult Basharat World NPC Sprite: 48 x 64
    this.createTexture(scene, 'npc_basharat_world', 48, 64, (ctx) => {
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(24, 60, 15, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Linen trousers
      ctx.fillStyle = '#e2d9cc';
      ctx.fillRect(17, 42, 6, 18);
      ctx.fillRect(25, 42, 6, 18);

      // White shoes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(15, 58, 8, 4);
      ctx.fillRect(25, 58, 8, 4);

      // Open crisp white shirt
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(15, 25, 18, 19);

      // Fair skin neck & face
      ctx.fillStyle = '#fcd9c5';
      ctx.fillRect(21, 22, 6, 5);
      ctx.beginPath();
      ctx.arc(24, 15, 9, 0, Math.PI * 2);
      ctx.fill();

      // Man-bun hair
      ctx.fillStyle = '#1e1b18';
      ctx.beginPath();
      ctx.arc(24, 13, 9, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
      // Bun
      ctx.beginPath();
      ctx.arc(24, 4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Light beard
      ctx.fillStyle = 'rgba(30, 27, 24, 0.4)';
      ctx.beginPath();
      ctx.arc(24, 19, 5, 0, Math.PI);
      ctx.fill();
    });

    // Mohalla Elder NPC Sprite
    this.createTexture(scene, 'npc_elder_world', 48, 64, (ctx) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(24, 60, 15, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(16, 25, 16, 35);

      ctx.fillStyle = '#ba8d7e';
      ctx.beginPath();
      ctx.arc(24, 15, 9, 0, Math.PI * 2);
      ctx.fill();

      // White beard
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(24, 19, 6, 0, Math.PI);
      ctx.fill();

      // Green cap
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(18, 6, 12, 6);
    });

    // Mohalla Environment props & buildings (Building blocks)
    // House 1: Maajid's House (300 x 240)
    this.createTexture(scene, 'building_maajid_house', 320, 260, (ctx) => {
      // Warm yellow-ochre mohalla house
      ctx.fillStyle = '#d97706';
      ctx.fillRect(10, 40, 300, 220);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 20, 320, 25);

      // Windows
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 70, 50, 60);
      ctx.fillRect(230, 70, 50, 60);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 70, 50, 60);
      ctx.strokeRect(230, 70, 50, 60);

      // Wooden Front Door
      ctx.fillStyle = '#78350f';
      ctx.fillRect(125, 150, 70, 110);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 3;
      ctx.strokeRect(125, 150, 70, 110);
      // Brass handle
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(180, 205, 5, 0, Math.PI * 2);
      ctx.fill();

      // Signboard: "MAAJID'S HOME"
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(110, 120, 100, 22);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText("MAAJID'S HOME", 118, 135);
    });

    // House 2: Basharat's House opposite (320 x 260)
    this.createTexture(scene, 'building_basharat_house', 320, 260, (ctx) => {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(10, 40, 300, 220);
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, 20, 320, 25);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 70, 50, 60);
      ctx.fillRect(230, 70, 50, 60);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 70, 50, 60);
      ctx.strokeRect(230, 70, 50, 60);

      // Door
      ctx.fillStyle = '#451a03';
      ctx.fillRect(125, 150, 70, 110);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(180, 205, 5, 0, Math.PI * 2);
      ctx.fill();

      // Signboard
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(95, 115, 130, 25);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('BASHARAT MANZIL', 105, 132);
    });

    // Mohalla Community Hall (400 x 280)
    this.createTexture(scene, 'building_mohalla_hall', 400, 280, (ctx) => {
      ctx.fillStyle = '#065f46';
      ctx.fillRect(10, 50, 380, 230);
      ctx.fillStyle = '#047857';
      ctx.fillRect(0, 30, 400, 25);

      // Grand arch door
      ctx.beginPath();
      ctx.arc(200, 160, 45, Math.PI, 0);
      ctx.lineTo(245, 280);
      ctx.lineTo(155, 280);
      ctx.closePath();
      ctx.fillStyle = '#1c1917';
      ctx.fill();

      // Sign
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(120, 95, 160, 26);
      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('MOHALLA HALL', 152, 113);
    });

    // Market Stall / Fish Stall (Machhli Market entrance) (240 x 180)
    this.createTexture(scene, 'stall_fish_market', 240, 180, (ctx) => {
      // Striped awning (red & white)
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = (i % 2 === 0) ? '#dc2626' : '#ffffff';
        ctx.fillRect(i * 30, 10, 30, 45);
      }
      // Wooden counter
      ctx.fillStyle = '#78350f';
      ctx.fillRect(10, 55, 220, 120);

      // Baskets & fresh fish
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.ellipse(60, 80, 24, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(180, 80, 24, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('MACHHLI BAZAAR', 65, 125);
    });

    // Street props: Street Lamp (32 x 96)
    this.createTexture(scene, 'prop_street_lamp', 32, 96, (ctx) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(14, 20, 4, 76);
      ctx.fillRect(8, 90, 16, 6);
      ctx.beginPath();
      ctx.arc(16, 18, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();
    });

    // Wooden Bench (80 x 48)
    this.createTexture(scene, 'prop_bench', 80, 48, (ctx) => {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(4, 10, 72, 14);
      ctx.fillRect(4, 28, 72, 10);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(8, 24, 6, 24);
      ctx.fillRect(66, 24, 6, 24);
    });
  }

  // ==========================================
  // UI ELEMENTS & BUTTONS
  // ==========================================
  static generateUIElements(scene) {
    // Dialogue Box panel (960 x 200)
    this.createTexture(scene, 'ui_dialogue_box', 960, 200, (ctx) => {
      // Rounded dark atmospheric RPG dialogue background
      ctx.fillStyle = 'rgba(7, 10, 19, 0.94)';
      ctx.beginPath();
      ctx.roundRect(0, 0, 960, 200, 14);
      ctx.fill();

      // Golden ornate border
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(2, 2, 956, 196, 12);
      ctx.stroke();

      // Subtle inner glow
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(6, 6, 948, 188, 10);
      ctx.stroke();
    });

    // Dialogue Nameplate (240 x 46)
    this.createTexture(scene, 'ui_nameplate', 240, 46, (ctx) => {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.roundRect(0, 0, 240, 46, 8);
      ctx.fill();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(2, 2, 236, 42, 6);
      ctx.stroke();
    });

    // Choice Button (520 x 48)
    this.createTexture(scene, 'ui_choice_btn', 520, 48, (ctx) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.roundRect(0, 0, 520, 48, 8);
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(1, 1, 518, 46, 7);
      ctx.stroke();
    });

    // General RPG Modal Panel (920 x 580)
    this.createTexture(scene, 'ui_panel_large', 920, 580, (ctx) => {
      ctx.fillStyle = 'rgba(11, 15, 25, 0.97)';
      ctx.beginPath();
      ctx.roundRect(0, 0, 920, 580, 16);
      ctx.fill();

      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(3, 3, 914, 574, 14);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(8, 8, 904, 564, 10);
      ctx.stroke();
    });

    // Navigation Tab Button (160 x 44)
    this.createTexture(scene, 'ui_tab_btn', 160, 44, (ctx) => {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(0, 0, 160, 44, 6);
      ctx.fill();

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(1, 1, 158, 42);
    });

    // Primary Menu Button (260 x 54)
    this.createTexture(scene, 'ui_btn_primary', 260, 54, (ctx) => {
      const grad = ctx.createLinearGradient(0, 0, 260, 0);
      grad.addColorStop(0, '#92400e');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#78350f');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(0, 0, 260, 54, 8);
      ctx.fill();

      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(2, 2, 256, 50, 6);
      ctx.stroke();
    });

    // Interaction Prompt Pill (240 x 40)
    this.createTexture(scene, 'ui_prompt_pill', 240, 40, (ctx) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.roundRect(0, 0, 240, 40, 20);
      ctx.fill();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(2, 2, 236, 36, 18);
      ctx.stroke();
    });
  }

  // ==========================================
  // ICONS (64 x 64)
  // ==========================================
  static generateIcons(scene) {
    // 1. Elathalam / Chhayyam brass cymbals icon
    this.createTexture(scene, 'icon_elathalam', 64, 64, (ctx) => {
      // Golden brass cymbal with knot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(32, 32, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(32, 32, 10, 0, Math.PI * 2);
      ctx.fill();

      // Red tying rope
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(32, 32);
      ctx.quadraticCurveTo(44, 14, 52, 6);
      ctx.stroke();
    });

    // 2. Health Heart (48 x 48)
    this.createTexture(scene, 'icon_hp', 48, 48, (ctx) => {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(24, 38);
      ctx.bezierCurveTo(8, 26, 6, 14, 14, 8);
      ctx.bezierCurveTo(20, 4, 24, 12, 24, 12);
      ctx.bezierCurveTo(24, 12, 28, 4, 34, 8);
      ctx.bezierCurveTo(42, 14, 40, 26, 24, 38);
      ctx.fill();
    });

    // 3. Stamina Bolt (48 x 48)
    this.createTexture(scene, 'icon_stamina', 48, 48, (ctx) => {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(28, 4);
      ctx.lineTo(12, 26);
      ctx.lineTo(24, 26);
      ctx.lineTo(20, 44);
      ctx.lineTo(36, 20);
      ctx.lineTo(24, 20);
      ctx.closePath();
      ctx.fill();
    });

    // 4. Knife / Dagger icon (from childhood incident)
    this.createTexture(scene, 'icon_knife', 64, 64, (ctx) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(48, 12);
      ctx.lineTo(52, 16);
      ctx.lineTo(28, 44);
      ctx.lineTo(22, 40);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.fillRect(14, 44, 12, 12);
    });

    // 5. English & Math Study Notebook
    this.createTexture(scene, 'icon_notebook', 64, 64, (ctx) => {
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(14, 8, 36, 48);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(18, 12, 28, 40);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(22, 18, 20, 3);
      ctx.fillRect(22, 24, 20, 3);
      ctx.fillRect(22, 30, 16, 3);
    });

    // 6. Transparent Glasses
    this.createTexture(scene, 'icon_glasses', 64, 64, (ctx) => {
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.strokeRect(8, 22, 20, 16);
      ctx.strokeRect(36, 22, 20, 16);
      ctx.beginPath();
      ctx.moveTo(28, 30);
      ctx.lineTo(36, 30);
      ctx.stroke();
    });

    // 7. Fish / Mohalla token
    this.createTexture(scene, 'icon_fish', 64, 64, (ctx) => {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(30, 32, 20, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(46, 32);
      ctx.lineTo(58, 22);
      ctx.lineTo(58, 42);
      ctx.closePath();
      ctx.fill();
    });
  }

  static createTexture(scene, key, width, height, drawFn) {
    if (scene.textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx);
    scene.textures.addCanvas(key, canvas);
  }
}
