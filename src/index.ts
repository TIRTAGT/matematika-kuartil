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

		// Start capturing inputs
		this.stdinpipe.resume();

		// On there is user input, call our custom function.
		this.stdinpipe.on("data", (data: Buffer) => {
			this.onStdinInput(data);
		});

		// Start asking the quartile input data type
		this.askSourceType();
	}

	onStdinInput(data: Buffer | string) {
		if (data instanceof Buffer) {
			data = data.toString();

			// Remove the padding \n at the end
			data = data.replace(/\n$/, "");
		}

		this.StdinResponse = data;
		
		// If we should call a callback
		if (this.StdinCallback) {
			// Call it
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

				// TODO: Implement the quartile group input
				console.log("Mode ini belum dibuat");
				process.exit(0);

				break;

			default:
				return this.askSourceType();
		}
	}

	askSingleQuartileData() {
		console.clear();

		// Display what we already have if there is any
		if (this.QuartileInputData.length > 0) {
			console.log("Data kuartil saat ini :", this.QuartileInputData.join(", "));
		}

		// Let the user know  they can type 'end' to mark input is done
		console.log("Jika sudah selesai memasukkan data, ketik 'end' lalu enter.");

		// Ask the user to enter input data if there is any left
		console.log("Masukkan angka kuartil, lalu tekan enter: ");
	}

	/** Handle the Single Quartile input data
	 * @param {string} input the input string from user
	 * @returns {boolean} whether it is inputted or not
	 */
	SingleQuartileDataHandler(input: string): boolean {
		// If user accidentally press enter without anything input
		if (input === "") {
			// Ask again
			this.askSingleQuartileData();
			return false;
		}

		let number : number  = Number(input);

		// Check if the input is not a number
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

		// Insert the value
		this.QuartileInputData.push(number);

		// Ask again
		this.askSingleQuartileData();

		return true;
	}

	onSingleQuartileInputDone() {
		console.clear();

		// If no data is inserted.
		if (this.QuartileInputData.length < 1) {
			console.error("Tidak dapat lanjut, tidak ada data kuartil tunggal yang dimasukan.");
			process.exit(1);
		}

		// Display all of the input numbers, comma seperated.
		console.log("Data kuartil yang dimasukkan :", this.QuartileInputData.join(", "));
		
		// Let the user know how much value is inserted.
		console.log("Jumlah data yang dimasukkan :" + this.QuartileInputData.length);

		// Replace event listener
		this.StdinCallback = () => {
			this.calculateSingleQuartile();
		};

		console.log("Tekan enter untuk melanjutkan...");
	}

	calculateSingleQuartile() {
		console.clear();
		console.log("Menghitung kuartil tunggal...");

		// Sort the input number first
		this.QuartileInputData.sort((c, b) => c - b);

		let QuartileLocation : number[] = [];
		let QuartileAnswer : number[] = [];
		let QuartileLength : number = this.QuartileInputData.length + 1;

		// Calculate Quartile Location (jumlah data * (targetQuartil / 4) )
		QuartileLocation[0] = (QuartileLength * 0.25); // Q1
		QuartileLocation[1] = (QuartileLength * 0.5); // Q2
		QuartileLocation[2] = (QuartileLength * 0.75); // Q3

		// Check if Quartile 1 had fractions (a.bc)
		if (!Number.isInteger(QuartileLocation[0])) {
			/** Since the location are between two number, we need to find answer between that number range
			 * 	Q1 = StartRange + Q1[0.25] * (End Range - Start Range)
			 * 
			 * 
			*/
			
			let StartRange = this.QuartileInputData[( Math.floor(QuartileLocation[0]) - 1 )];
			let EndRange = this.QuartileInputData[( Math.ceil(QuartileLocation[0]) - 1 )];

			QuartileAnswer[0] = ( StartRange + ( 0.25 * ( EndRange - StartRange  )));
		}
		else {
			QuartileAnswer[0] = this.QuartileInputData[(QuartileLocation[0] - 1)];
		}

		// Check if Quartile 2 had fractions (a.bc)
		if (!Number.isInteger(QuartileLocation[1])) {
			/** Since the location are between two number, we need to find answer between that number range
			 * 	Q2 = StartRange + Q2[0.5] * (End Range - Start Range)
			 * 
			 * 
			*/
			
			let StartRange = this.QuartileInputData[( Math.floor(QuartileLocation[1]) - 1 )];
			let EndRange = this.QuartileInputData[( Math.ceil(QuartileLocation[1]) - 1 )];

			QuartileAnswer[1] = ( StartRange + ( 0.50 * ( EndRange - StartRange  )));
		}
		else {
			QuartileAnswer[1] = this.QuartileInputData[(QuartileLocation[1] - 1)];
		}

		// Check if Quartile 3 had fractions (a.bc)
		if (!Number.isInteger(QuartileLocation[2])) {
			/** Since the location are between two number, we need to find answer between that number range
			 * 	Q3 = StartRange + Q2[0.5] * (End Range - Start Range)
			 * 
			 * 
			*/
			
			let StartRange = this.QuartileInputData[( Math.floor(QuartileLocation[2])  - 1 )];
			let EndRange = this.QuartileInputData[( Math.ceil(QuartileLocation[2]) - 1 )];

			QuartileAnswer[2] = ( StartRange + ( 0.75 * ( EndRange - StartRange  )));
		}
		else {
			QuartileAnswer[2] = this.QuartileInputData[(QuartileLocation[2] - 1)];
		}

		// Let the user know we will be printing the result below
		console.log("Jawaban :");

		// Display the results of Q1, Q2, and Q3
		console.log(`Lokasi Q1: ${ (QuartileLocation[0]) }, Nilai Q1: ${ QuartileAnswer[0] }`);
		console.log(`Lokasi Q2: ${ (QuartileLocation[1]) }, Nilai Q3: ${ QuartileAnswer[1] }`);
		console.log(`Lokasi Q3: ${ (QuartileLocation[2]) }, Nilai Q3: ${ QuartileAnswer[2] }`);
		
		process.exit(0);
	}
}

// Initialize the class
var a = new MatematikaKuartil();