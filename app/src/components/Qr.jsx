import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllQuizzes } from '../actions/QuizActions';
import { Container, Box } from '@mui/material';
import { useParams } from 'react-router';

const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();
  return <WrappedComponent {...props} params={params} />;
};

export class Qr extends Component {
  componentDidMount() {
    this.props.getAllQuizzes();
  }
  render() {
    let { someQuizzes } = this.props;
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        {someQuizzes &&
          someQuizzes.length > 0 &&
          someQuizzes
            .filter((quizId) => {
              return quizId._id === this.props.params.id;
            })
            .map((quiz) => {
              return (
                <Box>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=/quiz/${quiz._id}&amp;size=300x300`}
                    alt=''
                    title=''
                  />
                </Box>
              );
            })}
      </Container>
    );
  }
}

let QrWithRouter = withRouter(Qr);

const mapStateToProps = ({ quizBuilder: { someQuizzes } }) => ({
  someQuizzes,
});

export default connect(mapStateToProps, { getAllQuizzes })(QrWithRouter);
