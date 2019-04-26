export default class LoremIpsum {
	private lang: string;
	private loremIpsumTexts = {
		english: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."
	}

	constructor(defaultLang: string = 'persian')
	{
		this.lang = defaultLang;
	}

	generate(type: string = 'paragraphs', count: number = 1, lang: string = this.lang)
	{
		switch (type) {
			case 'characters':
				return this.generateCharacters(this.loremIpsumTexts[lang], count);
			case 'words':
				return this.generateWords(this.loremIpsumTexts[lang], count);
			case 'paragraphs':
				return this.generateParagraphs(this.loremIpsumTexts[lang], count);
			default:
				return this.loremIpsumTexts[lang];
		}
	}

	generateCharacters(text: string, charactersCount)
	{
		let loremOutput: string = "";

		while(text.length < charactersCount) {
			text += text;
		}

		loremOutput = text.substring(0, charactersCount);

		return loremOutput;
	}

	generateWords(text: string, wordCount)
	{
		let loremWords = text.split(" ");
		let loremOutput: string;

		while(loremWords.length < wordCount) {
			loremWords = loremWords.concat(loremWords);
		}

		loremOutput = loremWords.splice(0, wordCount).join(" ");

		return loremOutput;
	}

	generateParagraphs(text: string, paragraphCount)
	{
		let loremOutput: string = "";

		while (paragraphCount > 0) {
			loremOutput += text;
			paragraphCount--;
		}

		return loremOutput;
	}
}