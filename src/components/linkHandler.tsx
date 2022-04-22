import { Button, Input, Radio } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'

const ARTE_API = 'https://api.arte.tv/api/player/v2/config/'

const LinkHandler: React.FC = () => {
  const [link, setLink] = useState('')
  const [lang, setLang] = useState('de')
  const onProcess = async (link: string) => {
    const filteredVideoId = link.match(/\d+-\d+-A/g) || ''
    console.log(`${ARTE_API}${lang}/${filteredVideoId}`)
    const rawResponse = await fetch(`${ARTE_API}/${lang}/${filteredVideoId}`, {
      method: 'GET',
      redirect: 'follow',
    })
    console.log(await rawResponse)

    const string = await rawResponse.text()
    const json = string === '' ? {} : JSON.parse(string)
    console.log(json)

    return json
  }
  return (
    <Container>
      <VideoLinkInput
        name="video-link"
        autoFocus
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste arte video link here"
      />
      <Radio.Group onChange={(e) => setLang(e.target.value)} value={lang}>
        <Radio value={'de'}>DE</Radio>
        <Radio value={'fr'}>FR</Radio>
      </Radio.Group>
      <ProcessButton onClick={() => onProcess(link)}>Process</ProcessButton>
    </Container>
  )
}

const Container = styled.div`
  background-color: white;
  display: flex;
  width: 500px;
  margin: 25px;
`

const VideoLinkInput = styled(Input)`
  min-width: 300px;
  margin-right: 10px;
`

const ProcessButton = styled(Button)``

export default LinkHandler
