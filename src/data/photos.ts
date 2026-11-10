export type Photo = {
  id: string;
  src: string;
  full?: string;
  title: string;
  caption?: string;
};

export const PHOTOS: Photo[] = [
  {
    id: "1",
    src: "https://i.pinimg.com/736x/ce/1e/e7/ce1ee7ca9fcafd382a5ff846989cb09c.jpg",
    full: "https://i.pinimg.com/1200x/f9/1b/fc/f91bfc1a9425e643a9f369edfe578f18.jpg",
    title: "The Starry Night - Vincent van Gogh",
    caption:
      "1889 — A dreamlike night sky filled with swirling stars, glowing light, and expressive brushstrokes. One of Van Gogh's most celebrated masterpieces.",
  },
  {
    id: "2",
    src: "https://i.pinimg.com/736x/9c/55/cc/9c55cc8ef717befd2784e9c7a09808e7.jpg",
    full: "https://i.pinimg.com/736x/9c/55/cc/9c55cc8ef717befd2784e9c7a09808e7.jpg",
    title: "Sunflowers - Vincent van Gogh",
    caption:
      "1888 — A vibrant still life of golden sunflowers, expressing warmth, friendship, and the beauty of everyday life.",
  },
  {
    id: "3",
    src: "https://i.pinimg.com/736x/c5/d1/a9/c5d1a9503725dcf74753fdd6a0690bdc.jpg",
    full: "https://i.pinimg.com/736x/c5/d1/a9/c5d1a9503725dcf74753fdd6a0690bdc.jpg",
    title: "Café Terrace at Night - Vincent van Gogh",
    caption:
      "1888 — A charming café in Arles illuminated by warm yellow light beneath a brilliant blue evening sky.",
  },
  {
    id: "4",
    src: "https://i.pinimg.com/1200x/a4/a4/3b/a4a43b31c2cd33f5fede793e3f498885.jpg",
    full: "https://i.pinimg.com/1200x/a4/a4/3b/a4a43b31c2cd33f5fede793e3f498885.jpg",
    title: "Almond Blossom - Vincent van Gogh",
    caption:
      "1890 — Delicate almond blossoms stretching across a turquoise sky, celebrating new life, hope, and renewal.",
  },
  {
    id: "5",
    src: "https://i.pinimg.com/736x/46/14/95/4614953041d8ef264a645ad10ae5c4d3.jpg",
    full: "https://i.pinimg.com/736x/46/14/95/4614953041d8ef264a645ad10ae5c4d3.jpg",
    title: "Irises - Vincent van Gogh",
    caption:
      "1889 — A colorful garden of blooming irises, brought to life through flowing lines, vibrant contrasts, and expressive movement.",
  },
  {
    id: "6",
    src: "https://i.pinimg.com/736x/c6/0e/ce/c60ece9f994633eac981fc820081908c.jpg",
    full: "https://i.pinimg.com/736x/c6/0e/ce/c60ece9f994633eac981fc820081908c.jpg",
    title: "Bedroom in Arles - Vincent van Gogh",
    caption:
      "1888 — An intimate depiction of Van Gogh's bedroom in Arles, featuring bold colors, simple furniture, and an unusual perspective.",
  },
  {
    id: "7",
    src: "https://i.pinimg.com/736x/56/92/d5/5692d518cfd329f8bc1bff34281be2a6.jpg",
    full: "https://i.pinimg.com/736x/56/92/d5/5692d518cfd329f8bc1bff34281be2a6.jpg",
    title: "Wheatfield with Crows - Vincent van Gogh",
    caption:
      "1890 — A dramatic wheatfield beneath a stormy sky, where dark crows and winding paths create a powerful sense of tension.",
  },
  {
    id: "8",
    src: "https://i.pinimg.com/736x/c5/d1/a9/c5d1a9503725dcf74753fdd6a0690bdc.jpg",
    full: "https://i.pinimg.com/736x/c5/d1/a9/c5d1a9503725dcf74753fdd6a0690bdc.jpg",
    title: "The Night Café - Vincent van Gogh",
    caption:
      "1888 — An atmospheric café interior filled with intense reds, greens, and yellows, reflecting a deeply emotional vision of nightlife.",
  },
  {
    id: "9",
    src: "https://i.pinimg.com/736x/c2/c5/a3/c2c5a3594b60750d7958e6c02369f82f.jpg",
    full: "https://i.pinimg.com/736x/c2/c5/a3/c2c5a3594b60750d7958e6c02369f82f.jpg",
    title: "The Potato Eaters - Vincent van Gogh",
    caption:
      "1885 — A humble family gathered around a table, portraying the difficult lives of rural workers through earthy tones and dramatic light.",
  },
  {
    id: "10",
    src: "https://i.pinimg.com/1200x/ea/57/5d/ea575d1779c318cf996ddd642905733a.jpg",
    full: "https://i.pinimg.com/1200x/ea/57/5d/ea575d1779c318cf996ddd642905733a.jpg",
    title: "Self-Portrait with Bandaged Ear - Vincent van Gogh",
    caption:
      "1889 — A deeply personal self-portrait revealing Van Gogh's resilience and emotional vulnerability through expressive color.",
  },
  {
    id: "11",
    src: "https://i.pinimg.com/736x/6d/18/d7/6d18d7ab44b1bbf44c9483ab3b253e3c.jpg",
    full: "https://i.pinimg.com/736x/6d/18/d7/6d18d7ab44b1bbf44c9483ab3b253e3c.jpg",
    title: "The Yellow House - Vincent van Gogh",
    caption:
      "1888 — A sunlit street in Arles featuring the bright yellow house where Van Gogh dreamed of building an artistic community.",
  },
  {
    id: "12",
    src: "https://i.pinimg.com/736x/74/5b/50/745b5005fcf18804e19f225d029f7db0.jpg",
    full: "https://i.pinimg.com/736x/74/5b/50/745b5005fcf18804e19f225d029f7db0.jpg",
    title: "Starry Night Over the Rhône - Vincent van Gogh",
    caption:
      "1888 — Golden reflections shimmer across the Rhône River beneath a peaceful night sky illuminated by brilliant stars.",
  },
  {
    id: "13",
    src: "https://i.pinimg.com/1200x/cf/82/29/cf82294642c1899ebc688b1e00d5504e.jpg",
    full: "https://i.pinimg.com/1200x/cf/82/29/cf82294642c1899ebc688b1e00d5504e.jpg",
    title: "Wheat Field with Cypresses - Vincent van Gogh",
    caption:
      "1889 — Towering cypress trees rise above golden wheatfields beneath a swirling sky, capturing the energy of nature.",
  },
  {
    id: "14",
    src: "https://i.pinimg.com/736x/41/d2/08/41d20848954cd446bc58f801cc6478fc.jpg",
    full: "https://i.pinimg.com/736x/41/d2/08/41d20848954cd446bc58f801cc6478fc.jpg",
    title: "The Sower - Vincent van Gogh",
    caption:
      "1888 — A lone farmer scatters seeds across a field beneath a glowing sun, symbolizing life, labor, and the cycle of nature.",
  },
  {
    id: "15",
    src: "https://i.pinimg.com/1200x/b0/ba/35/b0ba3538b495ca7a0abc71d5387c6f40.jpg",
    full: "https://i.pinimg.com/1200x/b0/ba/35/b0ba3538b495ca7a0abc71d5387c6f40.jpg",
    title: "Portrait of Dr. Gachet - Vincent van Gogh",
    caption:
      "1890 — A contemplative portrait of the physician who cared for Van Gogh, expressing melancholy through color and gesture.",
  },
  {
    id: "16",
    src: "https://i.pinimg.com/1200x/d8/3a/10/d83a108a2915aa7e006bf78b1e3861f9.jpg",
    full: "https://i.pinimg.com/1200x/d8/3a/10/d83a108a2915aa7e006bf78b1e3861f9.jpg",
    title: "The Red Vineyard - Vincent van Gogh",
    caption:
      "1888 — Workers harvest grapes beneath a glowing sunset, transforming an ordinary vineyard into a landscape of rich colors.",
  },
  {
    id: "17",
    src: "https://i.pinimg.com/1200x/d3/a6/f4/d3a6f4a82adf7761b816321ef6b40daf.jpg",
    full: "https://i.pinimg.com/1200x/d3/a6/f4/d3a6f4a82adf7761b816321ef6b40daf.jpg",
    title: "Olive Trees with the Alpilles in the Background - Vincent van Gogh",
    caption:
      "1889 — Twisting olive trees and rolling mountains come alive through rhythmic brushstrokes and luminous green tones.",
  },
  {
    id: "18",
    src: "https://i.pinimg.com/736x/1e/a1/61/1ea161512f70ef6a3655c51f2c6f7c59.jpg",
    full: "https://i.pinimg.com/736x/1e/a1/61/1ea161512f70ef6a3655c51f2c6f7c59.jpg",
    title: "A Pair of Shoes - Vincent van Gogh",
    caption:
      "1886 — A simple pair of worn leather shoes becomes a moving study of everyday objects, texture, and human experience.",
  },
  {
    id: "19",
    src: "https://i.pinimg.com/736x/b9/1f/d8/b91fd8bdf99f6fb79dfc427b4fa4a1a4.jpg",
    full: "https://i.pinimg.com/736x/b9/1f/d8/b91fd8bdf99f6fb79dfc427b4fa4a1a4.jpg",
    title: "Landscape at Auvers in the Rain - Vincent van Gogh",
    caption:
      "1890 — A sweeping countryside landscape under rainfall, capturing movement, atmosphere, and the changing rhythms of nature.",
  },
  {
    id: "20",
    src: "https://i.pinimg.com/1200x/bd/a2/75/bda2759e1f73df78de1d53e464b6f854.jpg",
    full: "https://i.pinimg.com/1200x/bd/a2/75/bda2759e1f73df78de1d53e464b6f854.jpg",
    title: "Self-Portrait - Vincent van Gogh",
    caption:
      "1889 — An iconic self-portrait featuring expressive brushwork, intense colors, and a powerful sense of introspection.",
  },
];
