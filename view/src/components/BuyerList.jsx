import React, { Component } from 'react';
import { getBuyerEmails } from "../firebase";
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = theme => ({
    root: {
        colour: 'red'
    },
    button: {
        margin: '7%',
        padding: '1rem',
    },
    text: {
        textAlign: 'center',
        paddingTop: '3%',
    },
    buyerContainer: {
        borderRadius: '5px',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
        border: '1px solid #999999',
    },
    emailText: {
        textAlign: 'left',
        color: '#767676',
        padding: "10px 30px",
    },
});

class BuyerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buyerEmails: [],
        }
    }

    componentDidMount = async () => {
        this.unsubscribe = getBuyerEmails(this.props.userID, this.props.purchaseID, (receipts) => {
            this.setState({
                buyerEmails: receipts,
            })
            this.props.passEmails(this.state.buyerEmails);
        });
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    render() {
        const { classes } = this.props;
        return (
            (this.state.buyerEmails.length === 0) ?
                <p className={classes.text}>No Buyers Yet</p>
                :
                <>
                    <div className={classes.buyerContainer}>
                        <List component="nav" aria-label="contacts">
                            {this.state.buyerEmails.map(receipt =>
                                <ListItemText className={classes.emailText} primary={receipt.email} />

                            )}

                        </List>
                    </div>
                </>
        );
    }
}

export default withStyles(useStyles)(BuyerList);