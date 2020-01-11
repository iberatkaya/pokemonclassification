import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
import { APIResponse } from './interfaces';

const imageDim = 256;

export let predict = async (name: string) => {
   console.log('Predicting');
   let index = 0;
   if(name.includes(',')){
      while(name.length > 0 && index < name.length && name[index] != ',')
         index++;
      index++;
   }
   let newname = name.substring(index);
   const model = await tf.loadLayersModel("file://" + __dirname + '/model.json');
   let imgBuffer = Buffer.from(newname, 'base64');
   let image = await sharp(imgBuffer).resize(imageDim, imageDim, { fit: 'fill' }).toBuffer();
   let tensor = [tf.node.decodeImage(image)];
   let predtensor = tf.stack(tensor);
   let prediction = model.predict(predtensor);
   // @ts-ignore
   let data = await prediction.data() as Array<number>;
   tensor[0].dispose();
   predtensor.dispose();
   model.dispose();
   console.log(tf.memory());
   return { Bulbasaur: data[0].toFixed(2), Charmander: data[1].toFixed(2), Squirtle: data[2].toFixed(2) } as APIResponse;   
}