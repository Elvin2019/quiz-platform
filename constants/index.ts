export const alphabeticNumeral = (index: number) => {
    const asciiCode = index + 65;
    const letter = String.fromCharCode(asciiCode);
    return letter + ". ";
  };
  