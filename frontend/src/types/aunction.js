import PropTypes from "prop-types"

export const AunctionType = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  starting_price: PropTypes.number,
  current_bid: PropTypes.number,
  end_time: PropTypes.string,
  bids: PropTypes.arrayOf(PropTypes.number),
  active: PropTypes.bool,
}).isRequired
