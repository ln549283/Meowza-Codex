# Assets v1.1

Created with the built-in image-generation tool, then resized/encoded for delivery. No external artist pack or remote runtime image is required. The original generated PNGs are retained in the creation conversation; the repository contains production derivatives.

| Asset | Runtime / native location |
| --- | --- |
| Dreamy cat-tree background | `public/assets/backgrounds/cat-tree.webp` |
| Nimbus, grey closed-eye kitten | `public/assets/cats/nimbus.webp` |
| Moka, orange open-eye kitten | `public/assets/cats/moka.webp` |
| Meowza app icon | `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png` and Android `mipmap-*` |

## Generation briefs

### Background

Production background illustration for Meowza, a kawaii cat logic mobile game, portrait 1024x1536. Dreamy cozy pastel world, premium hand-painted 2D casual game art, soft rounded shapes, lavender and peach with warm cream highlights. A fantastical tall cat scratching tree rises from a peach cushion garden at the very bottom into lilac clouds at the top. Cat tree has thick sisal wrapped posts, rounded blush and lavender carpet platforms, a cozy little cat-head doorway house in the lower third, tiny hanging pompom toys. Keep the entire central 65 percent spacious and light with sparse detail because interactive level platforms and text will be overlaid in Phaser. Decorative plants only at bottom corners. Two tiny sleeping cats may appear at bottom corners. No letters, no text, no UI, no numbers, no watermark, no grid. Full bleed illustrated background, polished charming storybook game art with soft ambient shading, no photorealism.

### Nimbus

ONE isolated silver-lilac grey kitten head only, front view, round puffy marshmallow cheeks, small triangular ears with pink inside, tiny gentle smile, closed happy crescent eyes, three subtle forehead stripes, peach blush. Soft polished 2D game illustration with clean silhouette, warm plum outline and smooth lavender shading, cozy pastel storybook look. Head fills 85% of a square image and is centered with equal padding. Genuine transparent background, no background color, no floor, no shadow outside the head, no frame, no text, no body, no accessories. Must read very clearly at 48 pixels.

### Moka

Matching orange kitten head sprite from the grey kitten reference. Preserve the round head silhouette, layout, padding, ears, smooth kawaii illustration finish and transparent background. Change grey-lavender fur to warm apricot orange with caramel forehead stripes and cream lower cheeks. Change closed crescent eyes to large round dark brown open eyes with little white catchlights so players distinguish cats by expression as well as color. Same tiny pink nose and happy smile. Only the head, no body, no text, no border, no floor, genuine alpha transparent background. Clean at small game size.

### App icon

Square mobile app icon using the two kitten heads as references. A lavender-grey closed-eye kitten and apricot-orange open-eye kitten cuddle cheek to cheek diagonally, occupy the central 70% safe area, on a solid warm lavender background with a subtle cream heart between them. Cohesive soft kawaii game illustration, clean recognizable silhouette at small size, saturated enough to stand out. No words, no letters, no border, no rounded corners baked in. Fully opaque full-bleed square background; keep both ears away from image edges for Android adaptive icon masks. Match the supplied character design.

## Packaging

Background: 1024×1536 WebP, quality 88. Heads: 512×512 WebP, quality 92 with alpha quality 100. iOS icon: opaque 1024×1024 PNG. Android: launcher and round resources at 48/72/96/144/192, adaptive foreground at corresponding 108-unit sizes. Review actual launcher masks before release. Native launch screens reuse the generated icon: centered on cream on iOS, and through the Android SplashScreen theme.
