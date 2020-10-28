export function getRandomDinoUrl() {
  const dinos = [
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/tada-dino.jpg',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/coffee-dino.jpg',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/drake-template-dino.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/ugh.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/Catseye124-dino-hugs.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/marsx03-orpheus-%26-rubber-duck-buddy.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/Pinklady28001-Love-dino.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/techiee619-dino.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/poker-face-dino.jpg',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/harry-dino.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/pirate-dino.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/drawing-dino.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/leaping_dino.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/dinosaur_waving.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/dinosaur_sealing_letters_with_wax.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/i_have_failed.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/dinosaur_holding_rubber_duck.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/cake_dino.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/code_dinosaur.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/restaurant_dinosaur.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/money_dinosaur_2.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/motivational_dinosaur.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/dino-emergency-meeting.png',
    'https://raw.githubusercontent.com/hackclub/dinosaurs/main/kayleyseow_OrpheusAndHearts.png',
  ]
  const url = dinos[Math.floor(Math.random() * dinos.length)]
  return url
}
export default async (req, res) => {
  const url = getRandomDinoUrl()
  res.status(200).json({ url })
}