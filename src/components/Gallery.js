import React from 'react'
import Photo from './Photo'
const Gallery =(props)=>{
    const {isLoading, title, photos} = props;
    if(!isLoading && photos.length === 0)
        return <div>Sorry, no results for search: <strong>"{props.searchTerm}"</strong>, Please Try again</div>;
    else 
        return(
            isLoading?
                <React.Fragment>
                    <div className='loading'></div>
                    <h4 style={{margin: '0 auto'}}>Loading...</h4>
                </React.Fragment>
            :
                <div className="photo-container">
                    <h2>{title}</h2>
                    <ul>
                        {photos.map( (url,index) => <Photo key={index} url={url} />)}
                    </ul>
                </div>
        );
}

export default Gallery;