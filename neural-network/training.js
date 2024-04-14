//https://www.youtube.com/watch?v=GNcGPw_Kb_0&t=798s&ab_channel=Onigiri
//исходный код на Java

const fs = require("fs"); 
const sharp = require("sharp"); 

const getImageData = async (path, size, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await sharp(path + "/" + file)
                .raw()
                .toBuffer({ resolveWithObject: true }); 

            const pixels = [];

            for (let i = 0; i < size * size * 3; i += 3) {
                let value = 0;
                for (let j = 0; j < 3; j++) {
                    value += data[i + j];
                }
                value /= 3;

                pixels.push(value / 255); 
            }

            resolve({
                digit: Number(file[10]), // Получение цифры из имени файла
                pixels
            });
        } catch (error) {
            console.error("File: ", file);

            reject(error);
        }
    });
};

const getImagesData = async (size) => {
    const path = "./train50x50"; 

    const files = fs.readdirSync(path); 

    const imagesData = await Promise.all(
        files.map((file) => getImageData(path, size, file))
    ); // Получение данных по каждому изображению

    return imagesData;
};

const path = "./nn"; 

class Layer {
    constructor(size, nextLayerSize) {
        this.size = size;
        this.neurons = new Array(size).fill(0);
        this.biases = new Array(size).fill(0);
        this.weights = new Array(size).fill(0).map(() => new Array(nextLayerSize).fill(0));
    }
}

class NeuralNetwork {
    constructor(learningRate, sigmoid, dsigmoid, ...sizes) {
        this.learningRate = learningRate;
        this.sigmoid = sigmoid; 
        this.dsigmoid = dsigmoid; 
        this.layers = [];

        sizes.forEach((size, i) => {
            let nextLayerSize = i < sizes.length - 1 ? sizes[i + 1] : 0;
            this.layers.push(new Layer(size, nextLayerSize));

            this.layers[i].biases = this.layers[i].biases.map(() => Math.random() * 2.0 - 1.0); 
            this.layers[i].weights = this.layers[i].weights.map(() => new Array(nextLayerSize).fill(0).map(() => Math.random() * 2.0 - 1.0)); 
        });
    }

    // Прямое распространение входных данных через сеть
    feedForward(inputs) {
        this.layers[0].neurons = inputs.slice(); 
        for (let i = 1; i < this.layers.length; i++) {
            let prevLayer = this.layers[i - 1];
            let curLayer = this.layers[i];
            for (let j = 0; j < curLayer.size; j++) {
                curLayer.neurons[j] = 0;
                for (let k = 0; k < prevLayer.size; k++) {
                    curLayer.neurons[j] += prevLayer.neurons[k] * prevLayer.weights[k][j]; 
                }
                curLayer.neurons[j] += curLayer.biases[j];
                curLayer.neurons[j] = this.sigmoid(curLayer.neurons[j]); 
            }
        }
        return this.layers[this.layers.length - 1].neurons;
    }

    // Обратное распространение ошибки для корректировки весов
    backpropagation(targets) {
        let errors = new Array(this.layers[this.layers.length - 1].size);

        for (let i = 0; i < this.layers[this.layers.length - 1].size; i++) {
            errors[i] = targets[i] - this.layers[this.layers.length - 1].neurons[i]; 
        }

        for (let k = this.layers.length - 2; k >= 0; k--) {
            let prevLayer = this.layers[k];
            let curLayer = this.layers[k + 1];
            let errorsNext = new Array(prevLayer.size).fill(0);
            let gradients = new Array(curLayer.size).fill(0); 

            // Вычисление градиентов для каждого нейрона в текущем слое
            for (let i = 0; i < curLayer.size; i++) {
                gradients[i] = errors[i] * this.dsigmoid(this.layers[k + 1].neurons[i]); 
                gradients[i] *= this.learningRate; 
            }

            let deltas = new Array(curLayer.size).fill(0).map(() => new Array(prevLayer.size).fill(0)); 

            for (let i = 0; i < curLayer.size; i++) {
                for (let j = 0; j < prevLayer.size; j++) {
                    deltas[i][j] = gradients[i] * prevLayer.neurons[j]; 
                }
            }

            for (let i = 0; i < prevLayer.size; i++) {
                errorsNext[i] = 0;
                for (let j = 0; j < curLayer.size; j++) {
                    errorsNext[i] += prevLayer.weights[i][j] * errors[j]; 
                }
            }

            errors = errorsNext; 

            let weightsNew = new Array(prevLayer.weights.length).fill(0).map(() => new Array(prevLayer.weights[0].length).fill(0));

            for (let i = 0; i < curLayer.size; i++) {
                for (let j = 0; j < prevLayer.size; j++) {
                    weightsNew[j][i] = prevLayer.weights[j][i] + deltas[i][j]; // Корректировка весов
                }
            }

            prevLayer.weights = weightsNew; // Присваивание новых весов предыдущему слою

            for (let i = 0; i < curLayer.size; i++) {
                curLayer.biases[i] += gradients[i]; // Обновление смещений текущего слоя
            }
        }
    }

    saveWeightsToFile(file) {
        const weightsToSave = this.layers.map((layer) => layer.weights);
        const jsonWeights = JSON.stringify(weightsToSave);

        fs.writeFileSync(path + "/" + file, jsonWeights);
    }

    saveNeuronsToFile(file) {
        const neuronsToSave = this.layers.map((layer) => layer.neurons);
        const jsonNeurons = JSON.stringify(neuronsToSave);

        fs.writeFileSync(path + "/" + file, jsonNeurons);
    }

    saveBiasesToFile(file) {
        const biasesToSave = this.layers.map((layer) => layer.biases);
        const jsonBiases = JSON.stringify(biasesToSave);

        fs.writeFileSync(path + "/" + file, jsonBiases);
    }
}

const goThroughEpochs = (NN, imagesData, digits, epochs) => {
    for (let i = 0; i < epochs; i++) {я
        let correct = 0;
        for (let j = i * 100; j < i * 100 + 100; j++) {
            const startDigit = digits[j]; 
            const targets = new Array(10).fill(0); 
            targets[startDigit] = 1; 

            const output = NN.feedForward(imagesData[j].pixels); 

            let endDigit = 0; // Переменная для предполагаемой окончательной цифры
            let endDigitWeight = -1; // Вес предполагаемой окончательной цифры

            for (let d = 0; d < 10; d++) { 
                if (endDigitWeight < output[d]) { 
                    endDigitWeight = output[d];
                    endDigit = d;
                }
            }
            
            if (startDigit === endDigit) {
                correct++;
            }

            NN.backpropagation(targets); // Обратное распространение ошибки для корректировки весов
        }

        console.log(i, correct); 
    }
};

const learn = async () => {
    const sigmoid = (x) => 1 / (1 + Math.exp(-x)); 
    const dsigmoid = (y) => y * (1 - y);

    const NeuralNetworks = new NeuralNetwork(0.01, sigmoid, dsigmoid, 2500, 1000, 10); // Создание нейронной сети с заданными параметрами

    const imagesData = await getImagesData(50); 

    const digits = imagesData.map((imageData) => imageData.digit); 

    const epochs = 600; 

    goThroughEpochs(NeuralNetworks, imagesData, digits, epochs); 

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path); 
    }

    NeuralNetworks.saveWeightsToFile("weights.json"); 
    NeuralNetworks.saveNeuronsToFile("neurons.json"); 
    NeuralNetworks.saveBiasesToFile("biases.json"); 
};

learn();