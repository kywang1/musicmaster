import React,{Component} from 'react';
import './App.css';
import {FormGroup,FormControl,InputGroup,Glyphicon} from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';
import Recommendations from './Recommendations';

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
        var accessToken = "BQD-aKQamF3UlDStSpHqTfa53JGzBJTB9x-SCQ-EYGJ2C14kOAYNIAqHP6XQkp2nx51KQP03Kd1shYb7hfhwuSYFxEHlwts9_lHcYm6-Qjq3aqAAJgX5b4zLBiuGLIzqLrGM3RPAO3OwNOwV_0ERtQ4s7AS9nVt-T_0H&refresh_token=AQBl16uCock_B-S-xZPhW3BbxQsC4MPnbVKGUJqP_lmkG_Bu2CFL467wf4Xaksn8hm7mVwsNwxFBpmODHcq8zcw1j0oAQ-vjfydOGTxJ61Qx5F6NTd3SiyXPJBNDW0KbHJM";
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
            const artist = json.artists.items[0];
            this.setState({artist});

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
                const recommendations = json.tracks;
                this.setState({recommendations});
                console.log(this.state.recommendations);
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
                      />
                      <Recommendations
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
