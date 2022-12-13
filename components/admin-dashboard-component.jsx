import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
    font-size: 3em;
    color: #478ba2;
    font-weight: bold;
    line-height: 1em;
`;

const Lead = styled.p`
    font-size: 2em;
    color: black;
    font-weight: normal;
    line-height: 1em;
`;

const Wrapper = styled.section`
    padding: 4em;
    text-align: center;
    background: white;
`;

const imgStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
};

const Dashboard = () => {
    return (
        <div>
            <img style={imgStyle} src="images/banner-Nike.jpg" alt="dashboard-head" />
            <Wrapper>
                <Title>K25-HUFLIT</Title>
                <Lead>Chúng em chào cô Thu ạ.</Lead>
            </Wrapper>
        </div>
    );
};

export default Dashboard;
