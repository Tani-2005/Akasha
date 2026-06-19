The threshold is complete.
I have entered the hall.

Now build Stage 1: The Hall.

This is the environment the user sees
after crossing the threshold.
It is the world they will spend 
most of their time inside.
Get this right before anything else.

---

WHAT THE USER SEES

The user is now standing inside 
the vast open-air stone hall.

They are looking inward from the entrance.
The perspective is first-person.
They are small. The hall is enormous.

---

THE BACKGROUND SCENE

Use reference image 2 and reference image 3
I provided earlier as your primary visual guides.

The hall has these layers from back to front:

LAYER 1 — THE SKY (furthest back)
Visible through the circular oculus opening 
in the ceiling above.
Deep space. #080A14 base.
The Milky Way stretches across it —
a soft diagonal band of 
purple-white light: #6B5FA6 at 30% opacity.
Stars scattered throughout.
A full moon — slightly left of center,
high in the sky.
Moon color: cool silver-white #E8EEFF.
Moon size: substantial. 
It should feel close and present.
Not tiny. Not decorative.
A presence above the hall.

LAYER 2 — THE CEILING AND OCULUS
The circular opening frames the sky.
The ceiling around it is dark carved stone.
The oculus is perfectly circular.
The stone rim around it is 
ornately carved — dense patterns.
The opening should feel like 
it was built to face the heavens.

LAYER 3 — THE PILLARS
Massive carved stone pillars
rise on both sides of the hall.
Left side: 3 pillars visible,
receding into depth.
Right side: 3 pillars visible,
receding into depth.
The closest pillars are partially cropped
at the frame edges — they are too large 
to fit fully in view.
This makes the hall feel wider than the screen.

Each pillar:
- Dark stone: #1A1610 base
- Dense carved figures and patterns 
  on every surface
- South Indian Hoysala style carving
- Each pillar has carved niches 
  at multiple heights
- Some niches contain deepas (lit)
- Most niches are empty (dark)
- The hall starts with very few lit deepas —
  this is an early state of the archive

LAYER 4 — THE DEEPAS ON PILLARS
On the visible pillars,
place a small number of lit deepas.
Exactly 4 deepas total across all pillars.
Their positions should feel organic —
not evenly spaced, not symmetrical.
One high on the left pillar.
One low on the right pillar.
One mid-height further back on the left.
One near the back right.

Each deepa:
- A small warm amber flame: #E8821A
- A gentle soft glow around it: 
  40px radius, 20% opacity
- A slow organic flicker animation
- Casts faint amber light on the stone 
  immediately surrounding it

LAYER 5 — THE FLOOR
Dark reflective stone floor.
Color: #0D0B08
Slightly wet appearance.
The moonlight from above 
casts a faint silver reflection 
on the floor in the center.
The deepa flames cast tiny warm 
amber reflections near the pillars.
Stone is cracked and worn — ancient.
A circular carved pattern in the floor
at the center — subtle, worn, 
barely visible.

LAYER 6 — THE MANUSCRIPT PLINTH (foreground)
At the center of the scene,
slightly in the lower middle of the frame,
rests a stone plinth.
Low. Flat. Ancient. 
The same dark carved stone as the pillars.
On the plinth rests the 
closed palm leaf manuscript.

The manuscript:
- A flat rectangle of layered 
  pale golden-brown palm leaves
- Two dark strings binding it 
  through small holes
- Two thin wooden covers 
  top and bottom
- Color: warm tan-brown #C8A96E
- Size: feels small on the large plinth —
  this emphasizes the scale of the hall
- A very faint warm glow emanates 
  from within it —
  as if light is sleeping inside
- It sits perfectly still

---

ATMOSPHERE

Dust motes:
- Floating slowly throughout the hall
- Concentrated near the deepa light sources
- Very faint: #F5EDD6 at 15% opacity
- Size: 1px to 2px
- Slow upward drift: 10 to 15 seconds 
  per cycle
- 20 to 30 particles total across the scene

Ambient light:
- The hall is primarily lit by:
  1. Moonlight from above — 
     cool, silver, falling in a soft column
     from the oculus to the floor center
  2. The 4 deepa flames — 
     warm, amber, local to each flame
- Everywhere else is shadow.
- The contrast between 
  cool moonlight and warm deepa light
  is the visual soul of this scene.

The hall breathes:
- An extremely subtle slow parallax —
  as if the user is breathing,
  the scene shifts by 3px over 4 seconds
  and returns.
  Barely perceptible.
  The space should feel alive, not static.

---

THE ONLY TEXT ON THIS SCREEN

No labels.
No instructions.
No UI text.

The only text that appears:
After the user has been still 
for 6 seconds —
a single line fades in 
very gently at the bottom of the screen:

"Approach the manuscript."

Typography:
- Font: Cormorant Garamond italic
- Size: 14px
- Color: #F5EDD6
- Opacity: 35%
- Letter spacing: 0.12em
- Fade in duration: 3 seconds
- It disappears again after 4 seconds
- It does not repeat

This line exists only to guide 
first-time visitors.
It should feel like a whisper 
from the hall itself.
Not a UI instruction.

---

THE MANUSCRIPT INTERACTION HINT

When the user moves their cursor 
near the manuscript:
- The faint inner glow of the manuscript
  brightens slightly
- From barely visible to softly glowing
- Transition: 1.2 seconds ease-in-out
- No tooltip. No label. No cursor change.
- The manuscript simply responds —
  as if it senses their presence.

When the user clicks the manuscript:
- It is the trigger for Stage 2
- We will build Stage 2 separately
- For now, clicking the manuscript 
  simply registers the interaction
- Add a placeholder transition:
  the manuscript glows brighter for 0.5 seconds
  then Stage 2 will be connected later

---

HALL LOGIC IMPLEMENTATION

The number of lit deepas in the hall
must be a variable:
let activeInheritances = 4

This variable will increase by 1
each time a user completes 
and releases an inheritance.

The 4 currently lit deepas represent
4 inheritances already waiting in time.

When activeInheritances increases,
a new deepa randomly ignites
in one of the empty niches.

Build this as a state variable
so it can be updated later.

---

WHAT MUST NOT APPEAR

No navigation bar
No header
No footer
No buttons
No modal overlays
No scrollbar
No loading indicator
No modern UI element of any kind

---

QUALITY CHECK

Before showing me:

Look at the scene.

Does it feel like you have stepped inside
an ancient stone hall at night?

Is the moonlight column visible 
falling from the oculus to the floor?

Do the 4 deepa flames feel like
the only warm life in an otherwise 
ancient and silent space?

Does the manuscript on its plinth 
feel like it is waiting for someone?

If yes — show me.
If no — adjust first.

Use reference images 2 and 3 
as your visual guide throughout.