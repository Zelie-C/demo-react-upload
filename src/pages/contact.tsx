import Layout from '@/components/Layout';
import Container from '@/components/Container';
import FormRow from '@/components/FormRow';
import FormLabel from '@/components/FormLabel';
import InputText from '@/components/InputText';
import Button from '@/components/Button';
import React, { useState } from 'react';
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

function Contact() {
  /**
   * handleOnSubmit
  */
 
 const [file, setFile] = useState<File | undefined>();
 const [preview, setPreview] = useState<string | ArrayBuffer | null>()
 

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (typeof file === "undefined") return;

    const formData= new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "ugp1qoxq");
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
      )
      const data = response.json();
      console.log(data)
    } catch(error) {
      console.error(error)
    }
  }

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    }

    setFile(target.files[0])

    const file = new FileReader;

    file.onload = function() {
      setPreview(file.result)
    }

    file.readAsDataURL(target.files[0])
  }

  const onDrop = useCallback((acceptedFiles: Array<File>)=> {
    const file = new FileReader();

    file.onload = function () {
      setPreview(file.result)
    };

    file.readAsDataURL(acceptedFiles[0])
  }, []) 
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
   });

  return (
    <Layout>

      <Container>
        <h1 className="text-6xl font-black text-center text-slate-900 mb-20">
          Contact Us
        </h1>
        
        <form className="max-w-md border border-gray-200 rounded p-6 mx-auto" onSubmit={handleOnSubmit}>
          <FormRow className="mb-5">
            <FormLabel htmlFor="name">Name</FormLabel>
            <InputText id="name" name="name" type="text" />
          </FormRow>

          <FormRow className="mb-5">
            <FormLabel htmlFor="email">Email</FormLabel>
            <InputText id="email" name="email" type="email" />
          </FormRow>
          
          <FormRow className="mb-5">
            <FormLabel htmlFor="message">Message</FormLabel>
            <InputText id="message" name="message" type="text" />
          </FormRow>

          <FormRow className="mb-5">
            <FormLabel htmlFor="message">File</FormLabel>
            <input id="image" name="image" type="file" accept="image/png, image/jpg" onChange={handleOnChange}/>
            {preview && (
              <p><img src={preview as string} alt="Aperçu du téléchargement" /></p>
            )}
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Déposez les fichiers ici...</p>
              ) : (
                <p>
                  Faites glisser des fichiers ici, ou cliquez pour sélectionner des fichiers
                </p>
              )}
            </div>
          </FormRow>

          <Button>Submit</Button>
        </form>

      </Container>
    </Layout>
  )
}

export default Contact;
