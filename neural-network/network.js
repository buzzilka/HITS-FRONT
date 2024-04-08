//https://www.youtube.com/watch?v=GNcGPw_Kb_0&t=798s&ab_channel=Onigiri
//исходный код на Java

export function nnMain(biases, weights) {
    const sigmoid = (x) => 1 / (1 + Math.exp(-x));
 
    function feedForward(network, inputs) {
        network.layers[0].neurons = [...inputs];
 
        for (let i = 1; i < network.layers.length; i++) {
            let prevLayer = network.layers[i - 1];
            let curLayer = network.layers[i];
 
            for (let j = 0; j < curLayer.size; j++) {
                curLayer.neurons[j] = 0;
 
                for (let k = 0; k < prevLayer.size; k++) {
                    curLayer.neurons[j] += prevLayer.neurons[k] * prevLayer.weights[k][j];
                }
 
                curLayer.neurons[j] += curLayer.biases[j];
                curLayer.neurons[j] = sigmoid(curLayer.neurons[j]);
            }
        }
 
        return network.layers[network.layers.length - 1].neurons;
    }
 
    const network = {
        learningRate: 0.01,
        layers: []
    };
 
    const sizes = biases.map(prevLayer => prevLayer.length);
 
    biases.forEach((layerBiases, index) => {
        const size = sizes[index];
        const prevLayer = {
            size,
            neurons: new Array(size).fill(0),
            biases: [...layerBiases],
            weights: weights[index]
        };
        network.layers.push(prevLayer);
    });
 
    return {
        network,
        feedForward: (inputs) => feedForward(network, inputs)
    };
}