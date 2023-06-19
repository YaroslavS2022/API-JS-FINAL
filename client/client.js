// Create a new Vue instance
new Vue({
  el: '#app',
  data: {
    httpsMethod: 'GET',
    APIQuery: '',
    xmlEntry: '', 
    response: '', 
    code: '',
  },
  methods: {
    test() {
      const parts = this.APIQuery.split('/');
      return parts[parts.length - 1];
    },
    getCode() {
      const xmlCode = this.xmlEntry;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlCode, 'text/xml');
      const codeElement = xmlDoc.querySelector('opcode');
      if (codeElement) {
        const code = codeElement.textContent;
        this.code = code;
        console.log('CODE:', code);
        return code;
      }
      return '';
    },
    submitForm() {
      const port = 'https://localhost:4000';
      this.response = '';
      const url = port + this.APIQuery;
      this.test();
      axios({
        method: this.httpsMethod,
        url: url,
        headers: { 'Content-Type': 'text/xml' }, // Set the Content-Type header to text/xml
        data: this.xmlEntry, // Pass the XML data directly
      })
        .then((response) => {
          this.response = '';
          this.response = response.data;
          this.code = '';
          console.log(response);
        })
        .catch((error) => {
          console.error('Error:', error);
          this.response = 'Critical error while fetching data!\nCheck the console log for more information.';
        });
    },
    attachXMLFile(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.xmlEntry = reader.result;
      };
      reader.readAsText(file);
    },
    downloadXMLFile() {
      const xmlCode = this.response;
      const filename = 'data.xml';
      const blob = new Blob([xmlCode], { type: 'text/xml' });

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;

      // Simulate a click on the link to trigger the download
      link.click();

      // Remove the temporary link element
      link.remove();
    },
  },
  template: `
    <div>
      <select v-model="httpsMethod">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
      </select>
      <br>
      <br>
      <textarea v-model="APIQuery" placeholder="API query" rows="1" style="width: 65%"></textarea>
      <br>
      <br>
      <div style="display: flex;">
        <textarea v-model="xmlEntry" placeholder="XML entry" rows="20" style="width: 50%"></textarea>
        <textarea v-model="response" placeholder="Response" rows="20" style="width: 50%"></textarea>
      </div>
      <div style="display: flex;">
        <textarea v-model="code" placeholder="Code" rows="1" style="width: 50%"></textarea>
      </div>
      <br>
      <button @click="submitForm">Submit</button>
      <br>
      <br>
      <input type="file" @change="attachXMLFile" accept=".xml">
      <button @click="downloadXMLFile">Download XML</button>
    </div>
  `,
});
