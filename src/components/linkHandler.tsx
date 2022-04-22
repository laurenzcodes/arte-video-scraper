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
    var apiUrl =
      'https://api.arte.tv/api/player/v1/config/fr/' + filteredVideoId
    var xobj = new XMLHttpRequest()
    xobj.overrideMimeType('application/json') // no .responseType = "json" in IE
    xobj.open('GET', apiUrl, true)
    xobj.onload = function () {
      function error(msg: string, cName: string) {
        console.error(msg, cName)
      }
      var jsonResponse = JSON.parse(xobj.responseText)
      var videoJsonPlayer = jsonResponse.videoJsonPlayer
      var VSR = videoJsonPlayer.VSR
      if (VSR === undefined) {
        console.log(error('Error: API querry failed to ' + apiUrl, 'err'))
        return
      }

      var dataRaw = Object.keys(VSR)
        .map(function (k) {
          return VSR[k]
        })
        .sort(function (l, r) {
          var priority = [
            r.bitrate - l.bitrate,
            r.mimeType.localeCompare(l.mimeType),
            r.versionShortLibelle.localeCompare(l.versionShortLibelle),
          ]
          for (var i in priority) {
            // no Array.find in IE
            if (priority[i] !== 0) {
              return priority[i]
            }
          }
          return 0
        })

      var maxBitrate = Math.max.apply(
        null,
        dataRaw.map(function (e) {
          return e.bitrate
        })
      )
      var data = dataRaw
        .filter(function (r) {
          return r.bitrate === maxBitrate
        })
        .map(function (r) {
          return {
            URL: r.url,
            Format: r.mediaType,
            Version: r.versionLibelle,
            Bitrate: r.bitrate,
          }
        })
      console.log(data)
    }
    xobj.send(null)
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
