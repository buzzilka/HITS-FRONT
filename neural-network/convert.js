//https://nodejsdev.ru/api/fs/
const fs = require("fs");
const sharp = require("sharp");

const MNIST = "./train";
const newMNIST = "./train50x50";

const convertDataSet = async (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            await sharp(MNIST + "/" + file)
                .resize({ width: 50, height: 50 })
                .toFile(newMNIST + "/" + file);

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

const converted = async () => {
    const files = fs.readdirSync(MNIST);
    await Promise.all(files.map(convertDataSet));
};

converted();