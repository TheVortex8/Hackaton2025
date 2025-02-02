


export async function upload(file: File) {
  const url = `${import.meta.env.VITE_BASE_SERVER_URL}/upload`
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  })
  const json = await response.json();
  return json;
}

export async function train() {
  const url = `${import.meta.env.VITE_BASE_SERVER_URL}/train`

  const response = await fetch(url);
  const json = await response.json();
  console.log(json)
  return json;
}

export async function predict(train?: boolean) {
  const url = `${import.meta.env.VITE_BASE_SERVER_URL}/predict?train=${train}`
  
  const response = await fetch(url);
  const json = await response.json();
  console.log(json)
  return json;
}
  