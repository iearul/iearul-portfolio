import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
    projectId: 'j56dhgyj',
    dataset: 'production',
    apiVersion: '2022-09-25',
    useCdn: true,
    token: 'sk5GpMAbFnfKs5MGboAup1PDk96uWtwYtym15SAUVwQp59TP2m4CYEOZtMhh4Rn3cNcKeT82Yode6TjyMaCQtwOxNO6B5P9c0BqhdPd0qWTOFDsgPLvRmIF4ci4z6oKU6qytxTuYpZSHquCDlQIRcBMI5vQNStP4e6V5PxJeb5cLkKonoQWj'
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);