# **App Name**: Lilunch

## Core Features:

- QR Code Menu Access: Users can access a restaurant’s menu by scanning a QR code (`/m/{restaurantId}`). If no published menu exists, show a clear empty state.
- Allergen Profile Creation: Enable users to create and store allergen profiles locally using `localStorage`. Use the 14 official EU allergens. Provide a “My Allergens” button in the header to edit the profile at any time.
- Menu Filtering: Filter menu items based on the user’s selected allergens: Compatible: No allergens or traces from the user’s profile. Precaution: Item contains traces of allergens in the user’s profile. Incompatible: Item directly contains allergens in the user’s profile. Display sections in the order: Compatible → Precaution → Incompatible (collapsed accordion)
- Menu Display: Show categories with menu items as cards. Each card displays name, price, short description, allergens present, and “Last updated” timestamp. Collapsed incompatible section should indicate which allergen(s) caused the block (e.g., *“Contains gluten”*)
- Allergen Icon Recommendation: Use a mapping for the 14 EU allergens. Where official pictograms aren’t available, show a generic icon/emoji placeholder (can be swapped manually later).
- Legal Disclaimer: Display a fixed notice at the bottom of menu pages: *“Allergen information is provided by the restaurant. Please confirm with staff if in doubt.”*

## Style Guidelines:

- Primary color: Black `#000000` (used for CTAs and selected chips).
- Background color: White `#FFFFFF`.
- Accent color: Soft gray `#8A8A8A` for muted or secondary text.
- Warning color: Amber `#F59E0B` for “precaution” items.
- Danger color: Red `#EF4444` for “incompatible” items.
- Font: “Inter” (sans-serif).
- Display text: 28–34px semibold.
- Body text: 16px.
- Cards: Rounded borders (16–20px), soft shadows.
- Chips: Rounded pills; default gray outline; selected state black background with white text.
- Icons: Generic allergen icons/emojis, aiming for EU pictograms where possible.
- CTA button: Full-width, black background, white text, 56–64px tall, corners rounded (16–20px).