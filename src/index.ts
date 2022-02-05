/** Matematika Kuartil Tunggal dan Kelompok
 * 
 * @author Matthew Tirtawidjaja <matthew@tirtagt.xyz>
 * @async no
 * @class MatematikaKuartil
 * @version 1.0
 * @since 06 February 2022
 * @copyright Matthew Tirtawidjaja
 * @license MIT License
 * @link https://github.com/TIRTAGT/matematika-kuartil
 * 
 */


class MatematikaKuartil {
	private stdinpipe: NodeJS.ReadStream;
	public StdinResponse: string= "";
	public StdinCallback: (input: string) => void = () => {};
	public QuartileInputData : number[] = [];
	
	constructor() {
		this.stdinpipe = process.stdin;

		this.stdinpipe.resume();
		this.stdinpipe.on("data", (data: Buffer) => {
			this.onStdinInput(data);
		});

		this.askSourceType();
	}

	onStdinInput(data: Buffer | string) {
		if (data instanceof Buffer) {
			data = data.toString();

			// Remove the padding \n at the end
			data = data.replace(/\n$/, "");
		}

		this.StdinResponse = data;
		
		if (this.StdinCallback) {
			this.StdinCallback(data);
		}
	}

	askSourceType() {
		console.clear();
		console.log("Apakah tipe data kuartil anda ?");
		console.log("1. Tunggal");
		console.log("2. Kelompok");
		console.log("Tolong pilih tipe data kuartil anda, lalu tekan enter: ");

		this.StdinCallback = (input: string) => {
			this.parseSourceType(input);
		};
	}

	/** Check if the source type is either 1 or 2
	 * @param {string} input the input string from user
	 */
	parseSourceType(input: string) {

		switch (input.trim()) {
			case "1":
				// Single quartile

				// Replace event listener
				this.StdinCallback = (inputs: string) => {
					this.SingleQuartileDataHandler(inputs.trim());
				}

				this.askSingleQuartileData();
				break;

			case "2":
				// Group Quartile

				// Unregister event listener
				this.StdinCallback = () => {};
				break;

			default:
				return this.askSourceType();
		}
	}

	askSingleQuartileData() {
		console.clear();

		if (this.QuartileInputData.length > 0) {
			console.log("Data kuartil saat ini :", this.QuartileInputData.join(", "));
		}
		console.log("Jika sudah selesai memasukkan data, ketik 'end' lalu enter.");
		console.log("Masukkan angka kuartil, lalu tekan enter: ");
	}

	/** Handle the Single Quartile input data
	 * @param {string} input the input string from user
	 * @returns {boolean} whether it is inputted or not
	 */
	SingleQuartileDataHandler(input: string): boolean {
		if (input === "") {
			// Ask again
			this.askSingleQuartileData();
			return false;
		}

		let number : number  = Number(input);

		if (Number.isNaN(number)) {
			// If user said this is the end of input
			if (input == "end") {
				// Then we can proceed
				this.onSingleQuartileInputDone();
				return false;
			}

			// Ask again
			this.askSingleQuartileData();
			return false;
		}

		this.QuartileInputData.push(number);

		// Ask again
		this.askSingleQuartileData();

		return true;
	}

	onSingleQuartileInputDone() {
		console.clear();

		if (this.QuartileInputData.length < 1) {
			console.error("Tidak dapat lanjut, tidak ada data kuartil tunggal yang dimasukan.");
			process.exit(1);
		}

		console.log("Data kuartil yang dimasukkan :", this.QuartileInputData.join(", "));

		// Replace event listener
		this.StdinCallback = () => {
			this.calculateSingleQuartile();
		};

		console.log("Tekan enter untuk melanjutkan...");
	}

	calculateSingleQuartile() {
		console.clear();
		console.log("Menghitung kuartil tunggal...");

		// Sortir data terlebih dahulu
		this.QuartileInputData.sort((a, b) => a - b);

		let QuartileLocation : number[] = [];

		// Hitung lokasi kuartil (jumlah data * (targetQuartil / 4) )
		QuartileLocation[0] = Math.round(this.QuartileInputData.length * 0.25); // Q1
		QuartileLocation[1] = Math.round(this.QuartileInputData.length * 0.5); // Q2
		QuartileLocation[2] = Math.round(this.QuartileInputData.length * 0.75); // Q3

		console.log("Jawaban :");

		// Dapatkan nilainya berdasarkan lokasi kuartil
		console.log(`Lokasi Q1: ${(QuartileLocation[0] + 1)}, Nilai Q1: ${this.QuartileInputData[QuartileLocation[0]]}`);
		console.log(`Lokasi Q2: ${(QuartileLocation[1] + 1)}, Nilai Q3: ${this.QuartileInputData[QuartileLocation[1]]}`);
		console.log(`Lokasi Q3: ${(QuartileLocation[2] + 1)}, Nilai Q3: ${this.QuartileInputData[QuartileLocation[2]]}`);
		
		process.exit(0);
	}
}


var a = new MatematikaKuartil();