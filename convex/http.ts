import { httpRouter } from 'convex/server';

import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

http.route({
	path: '/clerk',
	method: 'POST',
	handler: httpAction(async (ctx, request) => {
		const payloadString = await request.text();
		const headerPayload = request.headers;

		try {
			const result = await ctx.runAction(internal.clerk.fulfill, {
				payload: payloadString,
				headers: {
					'svix-id': headerPayload.get('svix-id'),
					'svix-signature': headerPayload.get('svix-signature'),
					'svix-timestamp': headerPayload.get('svix-timestamp'),
				},
			});

			const generateName = (firstName: string, lastName: string) =>
				(!!lastName ? firstName + ' ' + lastName : firstName).trim();

			switch (result.type) {
				case 'user.created':
					await ctx.runMutation(internal.users.create, {
						tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.id}`,
						email: result.data.email_addresses[0].email_address,
						name: generateName(result.data.first_name, result.data.last_name),
						imageUrl: result.data.image_url,
					});
					break;
				case 'user.updated':
					await ctx.runMutation(internal.users.update, {
						tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.id}`,
						email: result.data.email_addresses[0].email_address,
						name: generateName(result.data.first_name, result.data.last_name),
						imageUrl: result.data.image_url,
					});
					break;
				case 'user.deleted':
					await ctx.runMutation(internal.users.remove, {
						tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.id}`,
					});
					break;
				case 'organizationMembership.created':
					await ctx.runMutation(internal.users.appendOrgToUser, {
						tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
						orgId: result.data.organization.id,
						// @ts-ignore new types are not sync in the node_module
						orgRole: result.data.role,
					});
					break;
				case 'organizationMembership.updated':
					await ctx.runMutation(internal.users.updateOrgInUser, {
						tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
						orgId: result.data.organization.id,
						// @ts-ignore new types are not sync in the node_module
						orgRole: result.data.role,
					});
					break;
				case 'organizationMembership.deleted':
					await ctx.runMutation(internal.users.removeOrgFromUser, {
						tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
						orgId: result.data.organization.id,
					});
					break;
			}

			return new Response(null, {
				status: 200,
			});
		} catch (err) {
			return new Response('Webhook Error', {
				status: 400,
			});
		}
	}),
});

export default http;
