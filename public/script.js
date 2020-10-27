fileInput = body.append('input')
          .attr('type', 'file')
          .attr('accept', 'image/*')
          .attr('capture', 'environment')
          .attr('name', 'file')
          .attr('id', 'file')

      fileLabel = body.append('label')
          .attr('for', 'file')
          .text('Photo')

      fileInput.node().addEventListener('change', async e => {
        console.log('Sending photo to mail services server')

        const fileData = e.target.files[0]
        console.log('File Received:', fileData)

        const fileType = 'png'
        const fileName = missionRecordId+'.'+fileType

        console.log('Creating form data')

        const form = new FormData()

        form.append('missionRecordId', missionRecordId)
        form.append('fileType', fileType)
        form.append('type', 'receiver')
        form.append('photo', fileData, {
            filename: fileName+'.'+fileType
        })

        console.log('Form created')

        const photoResponse = await (await fetch(appUrl+'photo-receipt', {
          method: 'POST',
          body: form
        })).json()

        statusText.text('Complete!')
        setDescriptionText(['Thanks, you are all set!'])

        console.log('Form submitted')