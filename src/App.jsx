import React,{Component} from 'react';
import './App.css';
import {FormGroup,FormControl,InputGroup,Glyphicon} from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';
//import Recommendations from './Recommendations';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            query:'',
            artist:null,
            tracks:[],
            recommendations:[]
        }
    }

    search(){
        const BASE_URL = "https://api.spotify.com/v1/search?";
        let FETCH_URL = BASE_URL+'q=' + this.state.query
                          + '&type=artist&limit=1';
        const RECOMMENDED_URL = "https://api.spotify.com/v1/recommendations";
        let ALBUM_URL = 'https://api.spotify.com/v1/artists/'; //{id}/top-tracks
        var accessToken = "BQD8c2owm5bi5sz9FuNkRk-JKWsUOzkRD0n-552ICYxiC9u8nsA2CkEunGupxUDAb78VO9h3r5EOSgo9HoMcXF8ybBAaNHLtWDqmSQmv59POrnRi-jtS2CNWPk13E5XrU169BnRyj-NjRug252ekYjuIjtRXL33QqfWX&refresh_token=AQCPh9RzwcLPvmEQPteUUNgSdEYzrl2NiBg3OJC_I1cpYSpmBmlbMFQnsKHH55wIhJcYuJPO7VCzhPMt6pKKAle-Mt-PYplzhOq8qMsPIPITDTn_DXirdc1avTD4AO7XKlM";

        var myOptions = {
          method:'Get',
          headers:{
            'Authorization':'Bearer '+ accessToken
          },
          mode: 'cors',
          cache:'default'
        }

        fetch(FETCH_URL,myOptions)
          .then(response => response.json())
          .then(json=>{
            console.log(json.artists);
            var artist;
            if(json.artists.items.length > 0){
              artist = json.artists.items[0];
              this.setState({artist});
            }else{
              return 0;
            }


            //Grab top Ten tracks from json
            FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`
            fetch(FETCH_URL,myOptions)
              .then(response=>response.json())
              .then(json=>{
                const {tracks} = json;
                this.setState({tracks});
              })
            //get recommendations
            FETCH_URL = `${RECOMMENDED_URL}?seed_artists=${artist.id}&min_energy=0.4&min_popularity=50&limit=10&market=US`;
            fetch(FETCH_URL,myOptions)
              .then(response=>response.json())
              .then(json=>{
                let recommendations = [];
                for (var i = 0; i < json.tracks.length; i++) {
                  if(json.tracks[i].preview_url !== null){
                    recommendations.push(json.tracks[i]);
                  }
                }
                this.setState({recommendations});
                /*
                const recommendations = json.tracks;
                this.setState({recommendations});
                console.log(this.state.recommendations);
                */
              })
          });
    }


    render(){
        return (
            <div className = "App">
                <div className = "App-title">Music Master from App</div>
                <FormGroup>
                    <InputGroup>
                        <FormControl
                            type = "text"
                            placeholder = "Search for an Artist"
                            value = {this.state.query}
                            onChange = {event=>{this.setState({query:event.target.value})}}
                            onKeyPress = {event=>{
                                if(event.key === 'Enter'){
                                    this.search()
                                }
                            }}
                        />
                        <InputGroup.Addon onClick = {()=>this.search()}>
                            <Glyphicon glyph="search"></Glyphicon>
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                {
                  this.state.artist !== null
                  ?
                    <div>
                      <Profile
                        artist = {this.state.artist}
                      />
                      <Gallery
                        tracks = {this.state.tracks}
                        recommendations = {this.state.recommendations}
                      />
                    </div>
                  : <div></div>
                }
            </div>
        )
    }
}

export default App;
