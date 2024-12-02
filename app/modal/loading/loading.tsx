import load from '../../img/loading.png'


const Loading = () => {

    return (
        <div className='loadingScreen'>
            <div>
                <img src={load.src}/>
                <p>Loading</p>
            </div>
        </div>
    )
}

export default Loading;