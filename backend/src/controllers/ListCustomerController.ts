
import { FastifyReply, FastifyRequest } from "fastify";
import { ListCustomerService } from "../services/ListCustomerService";
export class ListCustomerController {
  async handle(request:FastifyRequest, reply:FastifyReply){
    const listCustomerService = new ListCustomerService()
    const customer = await listCustomerService.execute()
    reply.send(customer)
  }
}