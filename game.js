// =====================================================
// UNWORDLE NES - game.js (with 2000-word list placeholder)
// =====================================================

// ---------- BASIC STATE ----------

const screens = {
    username: document.getElementById("username-screen"),
    menu: document.getElementById("menu-screen"),
    game: document.getElementById("game-screen"),
    leaderboard: document.getElementById("leaderboard-screen"),
    instructions: document.getElementById("instructions-screen"),
};

let currentUser = null;
let currentMode = null; // "daily" or "endless"
let secretWord = "";
const WORD_LENGTH = 5;
let maxGuesses = 6;
let guesses = [];
let score = 0;

const WORDS = [
"ABACK","ABAFT","ABAND","ABASH","ABATE","ABBEY","ABBOT","ABDOM","ABHOR","ABIDE",
"ABODE","ABOIL","ABORT","ABOUT","ABOVE","ABRID","ABUSE","ABYSS","ACORN","ACRED",
"ACRID","ACTOR","ACUTE","ADAGE","ADAPT","ADDER","ADDLE","ADEPT","ADMIN","ADMIT",
"ADOBE","ADOPT","ADORE","ADORN","ADULT","ADUST","ADVER","ADZES","AEGIS","AEONS",
"AERIE","AFFIX","AFIRE","AFOOT","AFORE","AFOUL","AFTER","AGAIN","AGAPE","AGATE",
"AGENT","AGILE","AGING","AGLOW","AGONY","AGREE","AHEAD","AHOLD","AIDER","AIMED",
"AIMER","AIRED","ALOFT","ALONE","ALONG","ALOUD","ALPHA","ALTAR","ALTER","AMASS",
"AMAZE","AMBER","AMBLE","AMEND","AMISS","AMITY","AMONG","AMPLE","AMPLY","AMUSE",
"ANGEL","ANGER","ANGLE","ANGRY","ANODE","ANOINT","ANOLE","ANVIL","APART","APHID",
"APING","APNEA","APPLE","APPLY","APRON","APTLY","ARBOR","ARCUS","ARENA","ARGUE",
"ARISE","ARMOR","AROMA","ARROW","ARSON","ARTIC","ASCOT","ASHEN","ASIDE","ASKED",
"ASKEW","ASPEN","ASPIC","ASSAY","ASSET","ATLAS","ATOLL","ATONE","ATTIC","AUDIO",
"AUDIT","AUGER","AUGHT","AUNTY","AURAL","AURAS","AVAIL","AVERT","AVIAN","AVOID",
"AWAIT","AWAKE","AWARD","AWARE","AWASH","AWFUL","AWOKE","AXIAL","AXIOM","AXLES",
"AZURE","BACON","BADGE","BADLY","BAGEL","BAGGY","BAILS","BAIRN","BAKED","BAKER",
"BALER","BALMY","BANAL","BANJO","BARBS","BARGE","BARKS","BARON","BASAL","BASIC",
"BASIN","BASIS","BASTE","BATCH","BATHE","BATON","BATTS","BAUDS","BAWDY","BAYOU",
"BEACH","BEADS","BEADY","BEAKS","BEAMS","BEANS","BEARD","BEARS","BEAST","BEATS",
"BEAUX","BECKS","BEECH","BEEFS","BEEFY","BEGUN","BEING","BELAY","BELCH","BELIE",
"BELLS","BELLY","BELOW","BELTS","BENCH","BERET","BERTH","BESET","BESOT","BESSE",
"BESTS","BETEL","BETON","BEVEL","BEZEL","BIBLE","BICEP","BIDDY","BIDER","BIDET",
"BIELD","BIGHT","BIGOT","BILGE","BILLY","BINGE","BINGO","BIPED","BIRCH","BIRTH",
"BISON","BITER","BITES","BITTY","BLAME","BLAND","BLANK","BLARE","BLAST","BLAZE",
"BLEAK","BLEAT","BLEED","BLEND","BLIMP","BLIND","BLINK","BLISS","BLITZ","BLOAT",
"BLOCK","BLOKE","BLOND","BLOOD","BLOOM","BLOWN","BLUER","BLUES","BLUFF","BLUNT",
"BLURB","BLURT","BLUSH","BOARD","BOAST","BOATS","BOBBY","BODGE","BODYS","BOGEY",
"BOGUS","BOILS","BOING","BOLES","BOLTS","BONED","BONES","BONEY","BONGO","BONUS",
"BOOBY","BOOST","BOOTH","BOOTS","BOOZE","BORAX","BORER","BORNE","BOSOM","BOSON",
"BOSSY","BOTCH","BOTHER","BOTTY","BOUND","BOWEL","BOWER","BOWLS","BOXER","BRACE",
"BRAID","BRAIN","BRAKE","BRAND","BRASH","BRASS","BRAVE","BRAVO","BRAWL","BRAWN",
"BREAD","BREAK","BREED","BRIAR","BRIBE","BRICK","BRIDE","BRIEF","BRINE","BRING",
"BRINK","BRINY","BRISK","BROIL","BROKE","BROOD","BROOK","BROOM","BROTH","BROWN",
"BRUNT","BRUSH","BRUTE","BUBBLE","BUDDY","BUDGE","BUGGY","BUGLE","BUILD","BUILT",
"BULGE","BULKY","BULLY","BUMPS","BUNCH","BUNNY","BURNT","BURST","BUSHY","BUSTS",
"BUSTY","BUTCH","BUTTE","BUTTS","BUZZY","CABAL","CABBY","CABIN","CABLE","CACAO",
"CACHE","CADET","CAGED","CAGES","CAIRN","CAKED","CAKES","CALFS","CALICO","CALLS",
"CALMS","CALVE","CAMEL","CAMEO","CAMPS","CANAL","CANDY","CANOE","CANON","CAPER",
"CAPES","CAPUT","CARAT","CARDS","CARET","CARGO","CAROL","CARPS","CARRY","CARTS",
"CARVE","CASED","CASES","CASTE","CASTS","CATCH","CATER","CATTY","CAULK","CAULS",
"CAVED","CAVES","CAVIL","CEASE","CEDAR","CELEB","CELLO","CELTS","CENSE","CHAFE",
"CHAIN","CHALK","CHAMP","CHANG","CHANT","CHAOS","CHAPS","CHARD","CHARM","CHART",
"CHASE","CHASM","CHATS","CHEAP","CHEAT","CHECK","CHEEK","CHEER","CHEFS","CHESS",
"CHEST","CHEWS","CHEWY","CHICK","CHIDE","CHIEF","CHILD","CHILL","CHIME","CHIMP",
"CHINA","CHINK","CHINO","CHINS","CHIPS","CHIRP","CHIVE","CHOCK","CHOIR","CHOKE",
"CHOMP","CHOPS","CHORD","CHORE","CHOSE","CHUCK","CHUMP","CHUNK","CHURN","CHUTE",
"CIDER","CIGAR","CINCH","CIONS","CIRCA","CIRRI","CITES","CIVIC","CIVIL","CLACK",
"CLAIM","CLAMP","CLANG","CLANK","CLASH","CLASP","CLASS","CLAWS","CLEAN","CLEAR",
"CLEAT","CLEFT","CLERK","CLICK","CLIFF","CLIMB","CLING","CLINK","CLOAK","CLOCK",
"CLONE","CLOSE","CLOTH","CLOUD","CLOVE","CLOWN","CLOYS","CLUBS","CLUCK","CLUES",
"CLUMP","CLUNG","CLUNK","COACH","COAST","COBRA","COCCI","COCKS","COCOA","CODER",
"CODES","COILS","COINS","COLDS","COLON","COLOR","COMET","COMFY","COMIC","COMMA",
"COMPO","COMPS","CONCH","CONDO","CONES","CONIC","CONKS","COOKS","COOLS","COOPS",
"COPED","COPES","COPRA","COPSE","CORAL","CORDS","CORED","CORES","CORGI","CORNS",
"CORNY","CORPS","COSTS","COUCH","COUGH","COULD","COUNT","COUPE","COUPS","COURT",
"COVEN","COVER","COVET","COVEY","COWER","COWLS","COYLY","CRABS","CRACK","CRAFT",
"CRAGS","CRAMP","CRANE","CRANK","CRASH","CRATE","CRAVE","CRAWL","CRAZE","CRAZY",
"CREAM","CREDO","CREED","CREEK","CREEN","CREEP","CREPE","CREPT","CRESS","CREST",
"CRICK","CRIED","CRIER","CRIES","CRIME","CRIMP","CRISP","CROAK","CROCK","CROFT",
"CRONE","CRONY","CROOK","CROON","CROPS","CROSS","CROWD","CROWN","CRUDE","CRUEL",
"CRUMB","CRUSH","CRUST","CRYER","CUBED","CUBES","CUBIC","CUDDY","CUDGE","CUFFS",
"CULLS","CULPA","CUMIN","CUNTS","CUPID","CURBS","CURDS","CURED","CURES","CURLS",
"CURLY","CURRY","CURSE","CURVE","CUSPS","CUTER","CUTIE","CUTUP","CYCLE","CYNIC",
"DADDY","DAFFY","DAILY","DAIRY","DAISY","DALLY","DANCE","DANDY","DARED","DARES",
"DARKS","DARKY","DARTS","DASHY","DATUM","DAUNT","DAVIT","DAWNS","DAZED","DEALT",
"DEANS","DEARS","DEATH","DEBIT","DEBTS","DEBUG","DEBUT","DECAL","DECAY","DECKS",
"DECOR","DECOY","DECRY","DEEDS","DEEMS","DEFER","DEIFY","DEIGN","DEISM","DEITY",
"DELAY","DELTA","DELVE","DEMON","DEMUR","DENIM","DENSE","DEPOT","DEPTH","DERBY",
"DESKS","DETER","DETOX","DEUCE","DEVIL","DIARY","DICED","DICES","DICEY","DICKS",
"DIETS","DIGIT","DILLY","DIMLY","DINER","DINGO","DINGS","DINGY","DINKY","DINOS",
"DIODE","DIPPY","DIRGE","DIRTY","DISCO","DISKS","DITCH","DITTO","DITTY","DIZZY",
"DOBBY","DOBRO","DOCKS","DODGE","DODGY","DOGMA","DOILY","DOING","DOLLY","DOMED",
"DOMES","DONOR","DONUT","DOOMS","DOOMY","DOORS","DOPEY","DORKS","DORKY","DORMY",
"DORSO","DOSER","DOSES","DOTTY","DOUBT","DOUGH","DOWDY","DOWEL","DOWER","DOWNY",
"DOWRY","DOYEN","DOZED","DOZEN","DOZER","DOZES","DRABS","DRAFT","DRAGS","DRAIN",
"DRAKE","DRAMA","DRAMS","DRANK","DRAPE","DRAWL","DRAWN","DREAD","DREAM","DREGS",
"DRESS","DRIED","DRIER","DRIES","DRIFT","DRILL","DRINK","DRIVE","DROLL","DRONE",
"DROOL","DROOP","DROPS","DROSS","DROVE","DROWN","DRUID","DRUNK","DRYAD","DRYER",
"DRYLY","DUALS","DUBBY","DUCAL","DUCAT","DUCKS","DUCTS","DUDES","DUELS","DUETS",
"DUFFS","DULLS","DULLY","DUMBO","DUMMY","DUMPS","DUMPY","DUNCE","DUNES","DUNKS",
"DUSKY","DUSTS","DUSTY","DUTCH","DWARF","DWELL","DWELT","DWINE","DYERS","DYING",
"EAGER","EAGLE","EARED","EARLS","EARLY","EARNS","EARTH","EASEL","EASES","EATEN",
"EATER","EAVES","EBONY","ECLAT","EDDIE","EDGED","EDGER","EDGES","EDIFY","EDICT",
"EERIE","EJECT","ELATE","ELBOW","ELDER","ELECT","ELEGY","ELFIN","ELIDE","ELITE",
"ELOPE","ELUDE","ELVEN","ELVES","EMBER","EMBED","EMCEE","EMEND","EMERY","EMOTE",
"EMPTY","ENACT","ENDED","ENDOW","ENDUE","ENEMA","ENEMY","ENJOY","ENNUI","ENROL",
"ENSUE","ENTER","ENTRY","ENVOY","EOSIN","EPOCH","EPOXY","EQUAL","EQUIP","ERASE",
"ERECT","ERGOT","ERRED","ERROR","ERUPT","ESSAY","ESTER","ETHER","ETHIC","ETHOS",
"ETUDE","EVICT","EVOKE","EXACT","EXALT","EXCEL","EXERT","EXILE","EXIST","EXPEL",
"EXTOL","EXTRA","EXULT","FABLE","FACED","FACET","FACES","FACIA","FACTS","FADER",
"FADES","FAILS","FAINT","FAIRS","FAIRY","FAITH","FAKED","FAKES","FAKIR","FALLS",
"FALSE","FAMED","FANCY","FANGS","FANNY","FARCE","FARED","FARES","FARMS","FARTS",
"FASTS","FATAL","FATED","FATES","FATTY","FAULT","FAUNA","FAVOR","FAWNS","FAZED",
"FAZES","FEARS","FEAST","FEATS","FECAL","FECES","FEIGN","FEINT","FELLA","FELON",
"FELTS","FEMUR","FENCE","FENDS","FENNY","FERNS","FERNY","FERRY","FETAL","FETCH",
"FETID","FETUS","FEUDS","FEVER","FEWER","FIBER","FIBRE","FICUS","FIELD","FIEND",
"FIERY","FIFES","FIFTH","FIFTY","FIGHT","FILCH","FILED","FILER","FILES","FILET",
"FILLY","FILMS","FILMY","FILTH","FINAL","FINCH","FINDS","FINES","FINIS","FINKS",
"FIORD","FIRED","FIRER","FIRES","FIRMS","FIRST","FISHY","FISTS","FITLY","FIVER",
"FIVES","FIXED","FIXER","FIXES","FIZZY","FJORD","FLACK","FLAGS","FLAIR","FLAKE",
"FLAKY","FLAME","FLANK","FLARE","FLASH","FLASK","FLATS","FLAWS","FLECK","FLEET",
"FLESH","FLICK","FLING","FLINT","FLIRT","FLOAT","FLOCK","FLOOD","FLOOR","FLOPS",
"FLORA","FLOSS","FLOUR","FLOUT","FLOWN","FLOWS","FLUFF","FLUID","FLUKE","FLUME",
"FLUNG","FLUNK","FLUSH","FLUTE","FLYER","FOAMY","FOCUS","FOGGY","FOIST","FOLDS",
"FOLKS","FOLLY","FONTS","FOODS","FOOLS","FOOTS","FORAY","FORDS","FORGE","FORGO",
"FORKS","FORMS","FORTE","FORTH","FORTY","FORUM","FOSSIL","FOULS","FOUND","FOUNT",
"FOURS","FOWLS","FOXES","FOYER","FRAIL","FRAME","FRANC","FRANK","FRAUD","FRAYS",
"FREAK","FREED","FREER","FREES","FRESH","FRIED","FRIER","FRIES","FRILL","FRISK",
"FRIZZ","FROCK","FROGS","FRONT","FROST","FROTH","FROWN","FROZE","FRUIT","FRUMP",
"FUDGE","FUGUE","FULLY","FUMES","FUNDS","FUNGI","FUNKY","FUNNY","FUROR","FURRY",
"FUSED","FUSES","FUSSY","FUTON","FUZZY","GABLE","GAFFE","GAILY","GAINS","GAITS",
"GALAX","GALES","GALLS","GAMER","GAMES","GAMMA","GAMUT","GASSY","GATED","GATES",
"GAUZE","GAVEL","GAWKY","GAZED","GAZER","GAZES","GEARS","GEESE","GELID","GEMMA",
"GENIE","GENRE","GENUS","GEODE","GHOST","GHOUL","GIANT","GIDDY","GIFTS","GIGAS",
"GIGGY","GILDS","GILLS","GILLY","GIMME","GIMPY","GIPSY","GIRLS","GIRLY","GIRTH",
"GIVER","GIVES","GLACE","GLAND","GLARE","GLASS","GLAZE","GLEAM","GLEAN","GLEES",
"GLIDE","GLINT","GLITZ","GLOAT","GLOBE","GLOOM","GLOOP","GLORY","GLOSS","GLOVE",
"GLOWS","GLUED","GLUES","GLUEY","GLYPH","GNASH","GNATS","GNOME","GOADS","GOALS",
"GOATS","GOBBY","GOBLE","GODLY","GOING","GOLDY","GOLFS","GOOEY","GOODY","GOOFY","GOOSE","GORGE","GORSE","GOTTA","GOUGE","GOURD","GOUTY","GOWNS","GRACE",
"GRADE","GRAFT","GRAIL","GRAIN","GRAMS","GRAND","GRANT","GRAPE","GRAPH","GRASP",
"GRASS","GRATE","GRAVE","GRAVY","GRAZE","GREAT","GREED","GREEK","GREEN","GREET",
"GRIEF","GRILL","GRIME","GRIMY","GRIND","GRINS","GRIPE","GRIPS","GRIST","GRITS",
"GROAN","GROIN","GROOM","GROPE","GROSS","GROUP","GROUT","GROVE","GROWL","GROWN",
"GRUEL","GRUFF","GRUNT","GUARD","GUAVA","GUESS","GUEST","GUIDE","GUILD","GUILT",
"GUISE","GULCH","GULLS","GULLY","GUMBO","GUMMY","GUPPY","GURUS","GUSHY","GUSTO",
"GUSTS","GUTSY","GYPSY","HABIT","HACKS","HADAL","HADES","HAIRS","HAIRY","HAJJI",
"HALED","HALER","HALES","HALLS","HALON","HALTS","HALVE","HAMMY","HAMPS","HANDS",
"HANDY","HANGS","HANKY","HAPLY","HAPPY","HARDY","HAREM","HARKS","HARMS","HARPS",
"HARPY","HARRY","HARSH","HASTE","HASTY","HATCH","HATED","HATER","HATES","HAULS",
"HAUNT","HAVEN","HAVOC","HAWKS","HAYED","HAZED","HAZEL","HAZER","HAZES","HEADS",
"HEADY","HEALS","HEAPS","HEARD","HEARS","HEART","HEATH","HEATS","HEAVE","HEAVY",
"HEDGE","HEELS","HEFTY","HEIRS","HELIX","HELLO","HELMS","HELPS","HENCE","HERBS",
"HERON","HERTZ","HESIT","HEWED","HEWER","HIDER","HIDES","HIGHS","HIKED","HIKER",
"HIKES","HILLS","HILLY","HINGE","HINTS","HIPPO","HIPPY","HIRED","HIRER","HIRES",
"HISSY","HITCH","HIVES","HOARD","HOARY","HOBBY","HOCKS","HOCUS","HOGAN","HOIST",
"HOKUM","HOLDS","HOLED","HOLES","HOLLY","HOMED","HOMER","HOMES","HOMEY","HONED",
"HONER","HONES","HONEY","HONKS","HONOR","HOODS","HOODY","HOOEY","HOOFS","HOOKS",
"HOOKY","HOOPS","HOOTS","HOPED","HOPER","HOPES","HOPPY","HORDE","HORNED","HORNY",
"HORSE","HOSED","HOSES","HOSTS","HOTLY","HOUND","HOURS","HOUSE","HOVEL","HOVER",
"HOWDY","HOWLS","HUBBY","HUFFS","HUGER","HULKS","HULKY","HULLS","HUMAN","HUMID",
"HUMOR","HUMPS","HUMUS","HUNCH","HUNKS","HUNKY","HUNTS","HURRY","HURTS","HUSKY",
"HUSSY","HUTCH","HYDRA","HYENA","HYMNS","HYPER","ICERS","ICING","IDEAL","IDEAS",
"IDIOM","IDIOT","IDLED","IDLER","IDLES","IDYLL","IGLOO","ILIAC","ILIAD","IMAGE",
"IMBUE","IMPEL","IMPLY","INANE","INBOX","INCUR","INDEX","INDIE","INERT","INFER",
"INFIX","INFRA","INGOT","INLAY","INLET","INNER","INPUT","INSET","INTER","INTRO",
"INURE","INVAR","IODIC","IONIC","IRATE","IRKED","IRONY","ISLET","ISSUE","ITCHY",
"ITEMS","IVORY","JABBY","JACKS","JADED","JADES","JAILS","JAKES","JALOP","JAMBS",
"JAMMY","JARLS","JASPE","JAUNT","JAWED","JAZZY","JELLO","JELLY","JERKY","JETTY",
"JEWEL","JIFFY","JIGGY","JIHAD","JILTS","JINNI","JINNS","JITTER","JIVED","JIVER",
"JIVES","JOCKS","JOINS","JOINT","JOIST","JOKED","JOKER","JOKES","JOLLY","JOLTS",
"JOULE","JOUST","JOWLS","JOYED","JUDGE","JUDOS","JUGGY","JUICE","JUICY","JUMBO",
"JUMPY","JUNKY","JUROR","KAYAK","KEBAB","KEDGE","KEELS","KEENS","KEEPS","KELLY",
"KELPS","KELPY","KEMPT","KENDO","KETCH","KETOL","KEYED","KHANS","KICKS","KICKY",
"KILNS","KILOS","KILTS","KINDA","KINGS","KINKS","KINKY","KIOSK","KIRBY","KITES",
"KIVAS","KIWIS","KNEAD","KNEED","KNEEL","KNEES","KNELL","KNELT","KNIFE","KNISH",
"KNITS","KNOBS","KNOCK","KNOLL","KNOWN","KNOWS","KOALA","KOANS","KOBOS","KOHLS",
"KOINE","KOMBU","KONDO","KOOKS","KOOKY","KOPHS","KORMA","KRAAL","KRAFT","KRAIT",
"KRILL","KRONA","KRONE","KUDOS","KUDZU","KUMYS","KURTA","KYACK","KYLIX","KYRIE",
"LABEL","LABOR","LACED","LACER","LACES","LACKS","LADEN","LADLE","LAGER","LAIRD",
"LAITY","LAKES","LAMBS","LAMED","LAMER","LAMES","LAMPS","LANCE","LANDY","LANES",
"LANKY","LAPEL","LAPSE","LARCH","LARDS","LARDY","LARGE","LARGO","LARVA","LASER",
"LASSO","LASTS","LATCH","LATER","LATHE","LATTE","LAUGH","LAVED","LAVER","LAVES",
"LAWNS","LAXER","LAXLY","LAYER","LAZED","LAZES","LEACH","LEADS","LEAFS","LEAFY",
"LEAKS","LEAKY","LEANS","LEANT","LEAPS","LEAPT","LEARN","LEASE","LEASH","LEAST",
"LEAVE","LEDGE","LEDGY","LEECH","LEERY","LEFTS","LEGAL","LEGGY","LEGIT","LEHRS",
"LEMME","LEMON","LEMUR","LENDS","LENSE","LENTO","LEPER","LEPTA","LESBI","LESSA",
"LESTS","LETUP","LEVEE","LEVEL","LEVER","LEWIS","LEYEN","LIANA","LIBEL","LIBRA",
"LICIT","LIDAR","LIDED","LIENS","LIFER","LIFTS","LIGHT","LIKEN","LIKES","LILAC",
"LIMBO","LIMBS","LIMES","LIMNS","LIMOS","LIMPS","LINED","LINEN","LINER","LINES",
"LINGO","LINKS","LINTY","LIONS","LIPID","LIPIN","LISLE","LITHE","LITRE","LIVED",
"LIVEN","LIVER","LIVES","LIZZY","LLAMA","LLANO","LOACH","LOADS","LOAFS","LOAMY",
"LOANS","LOATH","LOBBY","LOBED","LOBES","LOCAL","LOCHS","LOCKS","LOCUS","LODGE",
"LOESS","LOFTS","LOGAN","LOGIC","LOGOS","LOINS","LOIRE","LOLLS","LOMAS","LONER",
"LONGS","LOOMS","LOONS","LOOPS","LOOPY","LOOTS","LORDS","LORRY","LOSER","LOSES",
"LOSSY","LOTUS","LOUSE","LOUSY","LOVED","LOVER","LOVES","LOWER","LOWLY","LOYAL",
"LUCID","LUCKY","LUMEN","LUMPS","LUMPY","LUNAR","LUNCH","LUNGE","LUNGS","LUPUS",
"LURCH","LURED","LURER","LURES","LURID","LURKS","LUSTS","LUSTY","LYING","LYMPH",
"LYNCH","LYRIC","MACAW","MACES","MACHO","MACRO","MADAM","MADLY","MAFIA","MAGIC",
"MAGMA","MAGNA","MAIDS","MAILS","MAINS","MAIZE","MAJOR","MAKER","MAKES","MALAD",
"MALAR","MALES","MALLS","MALTS","MAMBO","MAMMA","MAMMY","MANGA","MANGE","MANGO",
"MANGY","MANIA","MANIC","MANLY","MANOR","MAPLE","MARCH","MARES","MARGE","MARIA",
"MARKS","MARSH","MARTS","MASON","MASSE","MASSY","MATCH","MATED","MATER","MATES",
"MATEY","MATTE","MAUVE","MAVEN","MAXIM","MAYBE","MAYOR","MAZES","MEALS","MEALY",
"MEANS","MEANT","MEATS","MEATY","MECCA","MEDAL","MEDIA","MEDIC","MELEE","MELON",
"MELTS","MEMES","MENDS","MENUS","MERCY","MERGE","MERIT","MERRY","MESAS","MESON",
"MESSY","METAL","METED","METER","METES","METRO","MEWED","MEWLS","MEZZO","MICRO",
"MIDST","MIENS","MIGHT","MIKED","MIKES","MILKY","MILLS","MILOS","MILTS","MIMED",
"MIMER","MIMES","MIMIC","MINCE","MINDS","MINED","MINER","MINES","MINIM","MINOR",
"MINTS","MINTY","MINUS","MIRTH","MISER","MISSY","MISTS","MISTY","MITER","MITES",
"MITRE","MIXED","MIXER","MIXES","MIZEN","MOANS","MOATS","MOCHA","MOCKS","MODAL",
"MODEL","MODEM","MODES","MOIST","MOLAR","MOLDS","MOLDY","MOLES","MOLTS","MOMMA",
"MOMMY","MONAD","MONDO","MONKS","MONTH","MOODS","MOODY","MOONS","MOORS","MOOSE",
"MOPED","MOPER","MOPES","MOPPY","MORAL","MORAY","MOREL","MORES","MORON","MORPH",
"MOSSY","MOTEL","MOTHS","MOTIF","MOTOR","MOTTO","MOULD","MOUND","MOUNT","MOURN",
"MOUSE","MOUSY","MOUTH","MOVED","MOVER","MOVES","MOVIE","MOWED","MOWER","MUCKS",
"MUCKY","MUCUS","MUDDY","MUFFS","MUFTI","MUGGY","MULCH","MULES","MULLS","MUMPS",
"MUMMY","MUNCH","MURKY","MUSED","MUSER","MUSES","MUSHY","MUSKY","MUSSE","MUSTS",
"MUSTY","MUTED","MUTER","MUTES","MUTTS","MUZZY","MYRRH","NABOB","NACHO","NADIR",
"NAILS","NAIVE","NAKED","NAMED","NAMER","NAMES","NANNY","NAPPY","NARCO","NARCS",
"NARES","NARIS","NASAL","NASTY","NATAL","NATCH","NATTY","NAVAL","NAVES","NAVVY",
"NEARS","NEATH","NEEDS","NEEDY","NEGRO","NEGUS","NEIGH","NERVY","NESTS","NETTY",
"NEVER","NEWEL","NEWER","NEWLY","NEWSY","NEXTS","NICER","NICHE","NICKS","NIFTY",
"NIGHS","NIGHT","NINES","NINJA","NINNY","NINTH","NIPPY","NITRO","NITTY","NOBLE",
"NODAL","NODES","NOISE","NOISY","NOMAD","NONCE","NORTH","NOSED","NOSER","NOSES",
"NOSEY","NOTCH","NOTED","NOTER","NOTES","NOUNS","NOVA","NOVEL","NOWAY","NUDGE",
"NUDIE","NUDLY","NURSE","NUTTY","NYLON","NYMPH","OAKEN","OAKUM","OARED","OASES",
"OASIS","OATHS","OBESE","OBEYS","OBJECT","OBLIG","OBOES","OCCUR","OCEAN","OCTAL",
"OCTET","ODDER","ODDLY","ODIUM","ODORS","ODOUR","OFFAL","OFFER","OFTEN","OGLED",
"OGLER","OGLES","OGRES","OILED","OILER","OINKS","OKAPI","OKAYS","OLDEN","OLDER",
"OLDIE","OLEIC","OLIVE","OMEGA","OMENS","OMITS","ONION","ONSET","OPALS","OPENS",
"OPERA","OPINE","OPIUM","OPTED","OPTIC","ORALS","ORATE","ORBIT","ORDER","ORGAN",
"ORTHO","OSCAR","OTHER","OTTER","OUGHT","OUNCE","OUTDO","OUTER","OUTGO","OUTRO",
"OVALS","OVARY","OVATE","OVENS","OVERT","OVINE","OVOID","OWING","OWLET","OWNED",
"OWNER","OXBOW","OXIDE","OXLIP","OZONE","PACED","PACER","PACES","PACKS","PADDY",
"PADRE","PAEAN","PAGAN","PAGED","PAGER","PAGES","PAILS","PAINS","PAINT","PAIRS",
"PALER","PALES","PALMS","PALSY","PANDA","PANEL","PANES","PANGS","PANIC","PANSY",
"PANTS","PAPAL","PAPER","PAPPY","PARDS","PARED","PARES","PARIS","PARKA","PARKS",
"PARSE","PARTS","PARTY","PASTA","PASTE","PASTY","PATCH","PATEN","PATER","PATES",
"PATHS","PATIO","PATSY","PATTY","PAUSE","PAVED","PAVES","PAWED","PAWER","PAWNS",
"PAYEE","PAYER","PEACE","PEACH","PEAKS","PEAKY","PEALS","PEARL","PEARS","PEART",
"PEASE","PEATS","PECAN","PECKS","PEDAL","PEDRO","PEEKS","PEELS","PEEPS","PEERS",
"PEERY","PEEVE","PEGGY","PEKOE","PELIC","PELTS","PENAL","PENCE","PENDS","PENIS",
"PENNY","PEONY","PEPPY","PERCH","PERIL","PERKS","PERKY","PERMS","PERRY","PERTH",
"PESKY","PESTS","PETAL","PETIT","PETTY","PHAGE","PHASE","PHONE","PHONY","PHOTO",
"PIANO","PICKY","PIECE","PIERS","PIETY","PIGGY","PIGMY","PIKED","PIKER","PIKES",
"PILAF","PILAR","PILOT","PILUS","PIMPS","PINCH","PINED","PINER","PINES","PINEY",
"PINGS","PINKS","PINKY","PINOT","PINTS","PINUP","PIONS","PIPED","PIPER","PIPES",
"PIPPY","PIQUE","PITCH","PITHY","PIVOT","PIXEL","PIXIE","PIZZA","PLACE","PLAIN",
"PLAIT","PLANE","PLANK","PLANT","PLATE","PLATS","PLATY","PLAZA","PLEAD","PLEAT",
"PLIED","PLIER","PLIES","PLINK","PLODS","PLOPS","PLOTS","PLOWS","PLOYS","PLUCK",
"PLUGS","PLUMB","PLUME","PLUMP","PLUMS","PLUSH","PLYER","POACH","POCKS","PODGY",
"POEMS","POESY","POINT","POISE","POKED","POKER","POKES","POLAR","POLED","POLER",
"POLES","POLIO","POLKA","POLLS","POLYP","PONDS","PONER","PONGS","PONZU","POOCH",
"POODS","POOFS","POOFY","POOLS","POOPS","POORI","POPES","POPPY","PORCH","PORED",
"PORER","PORES","PORKS","PORKY",];

// Fast lookup for valid guesses
const VALID_WORDS = new Set(WORDS);

// =====================================================
//  UTILS
// =====================================================

function showScreen(name) {
    Object.values(screens).forEach(s => s.style.display = "none");
    screens[name].style.display = "block";
}

function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

// Deterministic daily word
function getDailyWord() {
    const key = todayKey();
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    const index = hash % WORDS.length;
    return WORDS[index];
}

function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function clearBoard() {
    gameBoard.innerHTML = "";
    guesses = [];
}

// Scoring – same for daily & endless
function calculateScore(guessesUsed) {
    return (maxGuesses - guessesUsed + 1) * 10;
}

// =====================================================
//  GAME SETUP
// =====================================================

function startMode(mode) {
    currentMode = mode;
    clearBoard();
    gameMessage.textContent = "";
    guessInput.value = "";
    guessInput.maxLength = WORD_LENGTH;
    score = 0;

    if (mode === "daily") {
        secretWord = getDailyWord();
        gameModeLabel.textContent = "DAILY MODE";
    } else {
        secretWord = getRandomWord();
        gameModeLabel.textContent = "ENDLESS MODE";
    }

    scoreDisplay.textContent = "SCORE: 0";
    renderBoard();
    showScreen("game");
    guessInput.focus();
}

// =====================================================
//  RENDERING
// =====================================================

function renderBoard() {
    gameBoard.innerHTML = "";

    for (const guess of guesses) {
        const row = document.createElement("div");
        row.className = "row";

        const guessStr = guess.word;
        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = document.createElement("div");
            tile.className = "tile";

            const letter = guessStr[i] || "";
            tile.textContent = letter;

            if (!letter) {
                // empty
            } else if (letter === secretWord[i]) {
                tile.classList.add("green");
            } else if (secretWord.includes(letter)) {
                tile.classList.add("yellow");
            } else {
                tile.classList.add("red");
            }

            row.appendChild(tile);
        }

        gameBoard.appendChild(row);
    }

    for (let r = guesses.length; r < maxGuesses; r++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            row.appendChild(tile);
        }
        gameBoard.appendChild(row);
    }
}

// =====================================================
//  GUESS HANDLING
// =====================================================

function handleGuess() {
    const raw = guessInput.value.toUpperCase().trim();
    if (!raw) return;

    if (raw.length !== WORD_LENGTH) {
        gameMessage.textContent = `WORD MUST BE ${WORD_LENGTH} LETTERS.`;
        return;
    }

    if (!VALID_WORDS.has(raw)) {
        gameMessage.textContent = "NOT IN WORD LIST.";
        return;
    }

    if (guesses.length >= maxGuesses) {
        gameMessage.textContent = `OUT OF GUESSES. WORD WAS: ${secretWord}`;
        return;
    }

    guesses.push({ word: raw });
    renderBoard();
    guessInput.value = "";
    gameMessage.textContent = "";

    if (raw === secretWord) {
        const guessesUsed = guesses.length;
        score = calculateScore(guessesUsed);
        scoreDisplay.textContent = "SCORE: " + score;
        gameMessage.textContent = "YOU WIN!";
        submitScore(currentMode, score);
    } else if (guesses.length >= maxGuesses) {
        gameMessage.textContent = `OUT OF GUESSES. WORD WAS: ${secretWord}`;
    }
}

// =====================================================
//  LEADERBOARD
// =====================================================

async function loadLeaderboard() {
    leaderboardList.textContent = "LOADING...";

    const params = new URLSearchParams({
        type: lbType,
        mode: lbMode
    });

    try {
        const res = await fetch(`/.netlify/functions/getLeaderboard?${params.toString()}`);
        if (!res.ok) {
            leaderboardList.textContent = "ERROR LOADING LEADERBOARD.";
            return;
        }
        const data = await res.json();
        renderLeaderboard(data);
    } catch (err) {
        leaderboardList.textContent = "NETWORK ERROR.";
    }
}

function renderLeaderboard(entries) {
    if (!entries || entries.length === 0) {
        leaderboardList.textContent = "NO SCORES YET.";
        return;
    }

    leaderboardList.innerHTML = "";
    entries.forEach((row, idx) => {
        const div = document.createElement("div");
        div.className = "lb-row";

        const rank = document.createElement("span");
        rank.className = "lb-rank";
        rank.textContent = (idx + 1) + ".";

        const name = document.createElement("span");
        name.className = "lb-name";
        name.textContent = row.username || "PLAYER";

        const scoreSpan = document.createElement("span");
        scoreSpan.className = "lb-score";
        scoreSpan.textContent = row.score;

        div.appendChild(rank);
        div.appendChild(name);
        div.appendChild(scoreSpan);
        leaderboardList.appendChild(div);
    });
}

async function submitScore(mode, score) {
    if (!currentUser) return;

    const payload = {
        username: currentUser,
        mode,
        score
    };

    try {
        await fetch("/.netlify/functions/addScore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error("Error submitting score:", err);
    }
}

// =====================================================
//  EVENT LISTENERS
// =====================================================

// Username screen
usernameConfirmBtn.addEventListener("click", () => {
    const name = usernameInput.value.toUpperCase().trim();
    if (!name) {
        usernameError.textContent = "ENTER A NAME.";
        return;
    }
    if (name.length < 3) {
        usernameError.textContent = "NAME TOO SHORT.";
        return;
    }
    currentUser = name;
    localStorage.setItem("unwordle_username", currentUser);
    usernameError.textContent = "";
    welcomeText.textContent = `WELCOME, ${currentUser}!`;
    showScreen("menu");
});

usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        usernameConfirmBtn.click();
    }
});

// Menu
dailyModeBtn.addEventListener("click", () => startMode("daily"));
endlessModeBtn.addEventListener("click", () => startMode("endless"));
leaderboardBtn.addEventListener("click", () => {
    showScreen("leaderboard");
    loadLeaderboard();
});
instructionsBtn.addEventListener("click", () => showScreen("instructions"));
changeUserBtn.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem("unwordle_username");
    usernameInput.value = "";
    showScreen("username");
});

// Game
guessBtn.addEventListener("click", handleGuess);
guessInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleGuess();
});

backToMenuBtn.addEventListener("click", () => {
    showScreen("menu");
});

// Leaderboard controls
tabDaily.addEventListener("click", () => {
    lbType = "daily";
    tabDaily.classList.add("active");
    tabAllTime.classList.remove("active");
    loadLeaderboard();
});

tabAllTime.addEventListener("click", () => {
    lbType = "allTime";
    tabAllTime.classList.add("active");
    tabDaily.classList.remove("active");
    loadLeaderboard();
});

lbModeDaily.addEventListener("click", () => {
    lbMode = "daily";
    lbModeDaily.classList.add("active");
    lbModeEndless.classList.remove("active");
    loadLeaderboard();
});

lbModeEndless.addEventListener("click", () => {
    lbMode = "endless";
    lbModeEndless.classList.add("active");
    lbModeDaily.classList.remove("active");
    loadLeaderboard();
});

leaderboardBackBtn.addEventListener("click", () => {
    showScreen("menu");
});

// Instructions
instructionsBackBtn.addEventListener("click", () => {
    showScreen("menu");
});

// =====================================================
//  INIT
// =====================================================

(function init() {
    const saved = localStorage.getItem("unwordle_username");
    if (saved) {
        currentUser = saved.toUpperCase();
        usernameInput.value = saved.toUpperCase();
        welcomeText.textContent = `WELCOME, ${currentUser}!`;
        showScreen("menu");
    } else {
        showScreen("username");
    }
})();


