import { Button, Link, Typography } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { res200 } from '../Utils';

export default function(props) {
	// const [name, setName] = React.useState(null);
	// const [error, setError] = React.useState(false);
	const [value, setValue] = React.useState({});
	const { school } = props;
	// React.useEffect(
	// 	apiPostCB(
	// 		'/api/db/user/findById',
	// 		{ _id: school.userId },
	// 		(error, user) => {
	// 			setName(user && user.name);
	// 			setError(error);
	// 		}
	// 	),
	// 	[]
	// );
	return (
		<li style={{ display: 'flex', marginBottom: 20 }}>
			<img
				src={
					school.thumbnail ||
					'https://sanitationsolutions.net/wp-content/uploads/2015/05/empty-image.png'
				}
				alt="Thumbnail"
				style={{ width: 200, height: 150 }}
			/>
			<div style={{ marginLeft: 20 }}>
				<Link
					to={'/school/' + school.link}
					component={RouterLink}
					variant="h5"
				>
					<b>{school.name}</b>
				</Link>
				{school.summary ? (
					<Typography>{school.summary}</Typography>
				) : null}
				{/* {props.onDelete ? null : (
						<>
							<br />
							<b>Akun Pemilik:</b>{' '}
							{name && !error
								? name
								: error
								? error.response.data
								: 'loading...'}
						</>
					)} */}
				{props.onDelete ? (
					<>
						<Button
							variant="contained"
							color="primary"
							to={'/edit/' + school.link}
							component={Link}
							style={{ marginRight: 10 }}
						>
							Edit
						</Button>
						<Button
							variant="contained"
							color="secondary"
							disabled={value.loading}
							onClick={() => {
								setValue({ ...value, loading: true });
								(async () => {
									try {
										const res = await Axios.post(
											'api/removemyschool',
											{
												schoolId: school._id
											}
										);
										if (res200(res)) props.onDelete();
									} catch (error) {
										setValue({
											...value,
											error,
											loading: false
										});
									}
								})();
							}}
						>
							Hapus
						</Button>
					</>
				) : null}
			</div>
		</li>
	);
}
