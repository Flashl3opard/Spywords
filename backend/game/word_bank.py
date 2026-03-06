BASE_WORDS = [
    "apple", "anchor", "angel", "animal", "armor", "arrow", "astronaut", "avalanche", "azure", "badge",
    "balloon", "banana", "bank", "battery", "beach", "beacon", "bear", "beetle", "bell", "bicycle",
    "bird", "blade", "blizzard", "board", "boat", "bolt", "book", "bottle", "bridge", "broom",
    "browser", "bubble", "bucket", "cable", "camera", "candle", "cannon", "castle", "cat", "cave",
    "chain", "chair", "champion", "chart", "cheese", "chess", "circle", "city", "cloud", "clover",
    "code", "comet", "compass", "cookie", "coral", "crown", "crystal", "cup", "cyclone", "dagger",
    "dance", "desert", "diamond", "dinosaur", "doctor", "dog", "dragon", "drone", "drum", "eagle",
    "earth", "echo", "engine", "falcon", "feather", "field", "fire", "flame", "flash", "forest",
    "fork", "fountain", "fox", "galaxy", "garden", "ghost", "giant", "glacier", "globe", "gold",
    "grape", "gravity", "guitar", "hammer", "harbor", "hawk", "heart", "helmet", "hero", "honey",
    "horizon", "horse", "hospital", "ice", "island", "jacket", "jaguar", "jelly", "jungle", "key",
    "king", "kite", "knife", "ladder", "lake", "laser", "leaf", "lemon", "library", "light",
    "lion", "lock", "lotus", "machine", "magnet", "map", "marble", "market", "mask", "meteor",
    "microphone", "mirror", "monkey", "moon", "mountain", "music", "nebula", "needle", "network", "ninja",
    "notebook", "oasis", "ocean", "olive", "orange", "orbit", "owl", "paddle", "paint", "panda",
    "paper", "parachute", "parrot", "pearl", "penguin", "phoenix", "piano", "pirate", "planet", "plasma",
    "pocket", "poison", "portal", "potato", "puzzle", "queen", "quill", "rabbit", "radar", "rainbow",
    "rocket", "rose", "saddle", "sail", "satellite", "school", "scorpion", "screen", "scroll", "seal",
    "shadow", "shark", "shield", "ship", "shoe", "signal", "silver", "skull", "sky", "snow",
    "solar", "sound", "space", "spider", "spirit", "spring", "spy", "square", "star", "station",
    "storm", "submarine", "sugar", "sun", "sword", "table", "tablet", "temple", "thunder", "tiger",
    "time", "torch", "tower", "train", "treasure", "tree", "triangle", "trophy", "tulip", "tunnel",
    "turtle", "unicorn", "valley", "vampire", "vector", "violin", "volcano", "water", "wave", "whale",
    "wheel", "wind", "window", "wing", "wolf", "world", "xylophone", "yacht", "zebra", "zeppelin"
]

ADJECTIVES = [
    "ancient", "bright", "silent", "wild", "frozen", "golden", "hidden", "rapid", "electric", "midnight",
    "crimson", "azure", "emerald", "silver", "cosmic", "mystic", "stormy", "sunny", "lunar", "royal"
]

NOUNS = [
    "river", "crown", "blade", "tower", "forest", "signal", "portal", "compass", "harbor", "memory",
    "engine", "cipher", "bridge", "comet", "garden", "echo", "shield", "stone", "pirate", "voyage"
]

GENERATED_WORDS = [f"{adj}_{noun}" for adj in ADJECTIVES for noun in NOUNS]
WORDS = sorted(set(BASE_WORDS + GENERATED_WORDS))
