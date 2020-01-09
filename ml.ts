import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import sharp from 'sharp';
import Bulbasaur from './data/bulbasaur/bulbasaur';
import Charmander from './data/charmander/charmander';
import Squirtle from './data/squirtle/squirtle';

const imageDim = 244;

let run = async () => {
   let arr = [Object.values(Bulbasaur), Object.values(Charmander), Object.values(Squirtle)].flat();
   let labels: Array<number> = [];
   let tensorArray: Array<tf.Tensor> = [];
   try {
      for (let i = 0; i < arr.length; i++) {
         let image = await sharp(arr[i].img).resize(imageDim, imageDim, { fit: 'fill' }).toBuffer();
         let tensor = tf.node.decodeImage(image);
         if (tensor.size != imageDim * imageDim * 4) {    //2 images do not resize for some reason
            tensorArray.push(tensor);
            if (arr[i].type === 'bulbasaur')
               labels.push(0);
            else if (arr[i].type == 'charmander')
               labels.push(1);
            else
               labels.push(2);
         }
      }
      console.log(tf.memory());
      let tensorLabels = tf.oneHot(tf.tensor1d(labels, 'int32'), 3);
      const model = tf.sequential();
      model.add(tf.layers.conv2d({
         batchSize: 6,
         inputShape: [imageDim, imageDim, 3],
         activation: 'sigmoid',
         filters: 5,
         kernelSize: 5
      }));
      model.add(tf.layers.flatten());
      model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
      model.compile({
         optimizer: tf.train.sgd(0.0001),
         loss: tf.losses.meanSquaredError,
         metrics: ['accuracy']
      });
      await model.fit(tf.stack(tensorArray), tensorLabels, {
         validationSplit: 0.1,
         epochs: 10,
         shuffle: true
      }); 
      model.save('file:///home/berat/')
   } catch (e) {
      console.log(e);
   }
}

let predict = async (name: string) => {
   const model = await tf.loadLayersModel('file:///home/berat/nodeapps/ml/model.json');
   let image = await sharp('./' + name).resize(imageDim, imageDim, { fit: 'fill' }).toBuffer();
   let tensor = [tf.node.decodeImage(image)];
   let predtensor = tf.stack(tensor);
   let prediction = model.predict(predtensor);
   // @ts-ignore
   let data = await prediction.data() as number[];
   console.log("Bulbasaur: " + data[0].toFixed(2) + "\nCharmander: " + data[1].toFixed(2) + "\nSquirtle: " + data[2].toFixed(2) + '\n------------');   
}

predict('bul.jpeg');