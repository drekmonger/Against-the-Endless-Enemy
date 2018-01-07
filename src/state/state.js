export default {
    //general
    gameStatus: 0,
    /*gameStatus 0 = title
                 1 = map
                 2 = camp
                 3,4 = victory/defeat*/
    day: 1,
    initative: [],
    currentPawn: null,
    turnPhase: 0,
    //viable actions for pawns to take
    /*turnPhase 0 = none
        1 = player movement input
        2 = animating movement
        3 = player combat input
        4 = animating combat
        5 = monster activities
        10 = match over*/
    //
    actList: [],

    //animation crap
    skull: null,
    missle: null,

    //camp stuff
    camp: {
        supplies: 4,
        train: 0,
        patrolKills: 0,
        pickGuild: false,
        phase: 0,
        phaseReport: ["", "", ""],
    },
    //


    //map stuff
    maps: [
        [17592184193021, 9071212105777, 13529153502337, 15180299965409, 13470936596637, 12653013769217, 8863176720383], //3
        [17592186043393, 13194432219077, 16459310825601, 8843931165705, 16527612853385, 17317886918909, 17484820250623], //2
        [17592186042429, 16623777899265, 8803884060609, 9326594942993, 8933756383349, 9674353522689, 10858189029375], //1
        [17592185522209, 15609160583433, 16708637082537, 9006049459753, 12575838310025, 15327268698665, 8798282448895] //4
    ],

    grid: {},
    playerSpawn: [
        { x: 1, y: 5 },
        { x: 2, y: 6 },
        { x: 1, y: 7 },
        { x: 3, y: 5 },
        { x: 3, y: 7 }
    ],
    pawns: [],
    enemies: [],
    start: {},
    magicLine: null,
    monsterPoints: 3,
    //

    //map UI stuff
    tHovered: null, //tile
    tTimer: null,
    pHovered: null, //pawn

    //guild data
    guilds: [
        /*specials target number
         0 = self-pawn
         1 = monster
         2 or above is area and (size of area+1) So 2 is area 1.*/
        {
            desc: "Warrior",
            color: "#D3D3D3",
            attack: 5,
            move: 5,
            health: 7,
            aegis: 10,
            special:
                {
                    desc: "",
                    cost: 0,
                    range: 0,
                    attack: 2
                }
        },

        {
            desc: "Mage",
            color: "#00BFFF",
            attack: 1,
            move: 5,
            health: 3,
            aegis: 3,
            special:
                {
                    desc: "zap",
                    cost: 15,
                    range: 6,
                    attack: 6
                }
        },

        {
            desc: "Archer",
            color: "#8FBC8F",
            attack: 4,
            move: 7,
            health: 5,
            aegis: 4,
            special:
                {
                    desc: "arrow",
                    cost: 8,
                    range: 5,
                    attack: 4
                }
        },
        {
            desc: "Rogue",
            color: "Khaki",
            attack: 5,
            move: 9,
            health: 5,
            aegis: 3,
            special:
                {
                    desc: "knife",
                    cost: 5,
                    range: 3,
                    attack: 3
                }
        },
        {
            desc: "Beserk",
            color: "#D2691E",
            attack: 6,
            move: 6,
            health: 18,
            aegis: 1,
            special:
                {
                    desc: "",
                    cost: 3,
                    range: 0,
                    attack: 2
                }
        },
        {
            desc: "Witch",
            color: "#FFB6C1",
            attack: 2,
            move: 5,
            health: 3,
            aegis: 2,
            special:
                {
                    desc: "doom",
                    cost: 30,
                    range: 3,
                    attack: 20
                }
        },
        {
            desc: "Golem",
            color: "#708090",
            attack: 5,
            move: 3,
            health: 1,
            aegis: 15,
            special:
                {
                    desc: "",
                    cost: 0,
                    range: 0,
                    attack: 0
                }

        },
        {
            desc: "Amazon",
            color: "#FF69B4",
            attack: 5,
            move: 6,
            health: 10,
            aegis: 3,
            special:
                {
                    desc: "spear",
                    cost: 6,
                    range: 2,
                    attack: 5
                }
        },
        {
            desc: "Clown",
            color: "Orange",
            attack: 1,
            move: 6,
            health: 4,
            aegis: 2,
            special:
                {
                    desc: "joke",
                    cost: 0,
                    range: 3,
                    attack: 1
                }
        }
    ],

    //monster data
    monsters: [
        {
            cost: 1,
            attack: 2,
            range: 1,
            move: 7,
            health: 3,
            icon: "#m1"
        },

        {
            cost: 2,
            attack: 2,
            range: 6,
            move: 4,
            health: 6,
            icon: "#m2"
        },

        {
            cost: 3,
            attack: 3,
            range: 1,
            move: 4,
            health: 8,
            icon: "#m3"
        },

        {
            cost: 5,
            attack: 5,
            range: 1,
            move: 3,
            health: 15,
            icon: "#m4"
        }
    ]

}

