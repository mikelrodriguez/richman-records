export const BEATLES_LYRICS = [
    "All you need is love, love. Love is all you need.",
    "And in the end, the love you take is equal to the love you make.",
    "Take a sad song and make it better.",
    "There's nowhere you can be that isn't where you're meant to be.",
    "I'll follow the sun.",
    "Limitless undying love which shines around me like a million suns.",
    "With a love like that, you know you should be glad.",
    "Whisper words of wisdom, let it be.",
    "Here comes the sun, and I say, it's all right.",
    "Love has a nasty habit of disappearing overnight.",
    "Something in the way she moves attracts me like no other lover.",
    "Blackbird singing in the dead of night, take these broken wings and learn to fly.",
    "Yesterday, all my troubles seemed so far away.",
    "I get by with a little help from my friends.",
    "All my loving, I will send to you.",
    "Let it be, let it be, whisper words of wisdom.",
    "Ob-la-di, ob-la-da, life goes on, brah.",
    "I want to hold your hand.",
    "Words are flowing out like endless rain into a paper cup.",
    "Picture yourself in a boat on a river, with tangerine trees and marmalade skies."
];

export function getRandomLyric(): string {
    const min = 0;
    const max = BEATLES_LYRICS.length - 1;
    const randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
    return BEATLES_LYRICS[randomIndex];
}
