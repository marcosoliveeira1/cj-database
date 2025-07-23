Requisitos: Endpoint de Webhook em Lote
Objetivo
Criar um novo endpoint POST /webhooks/pipedrive/batch que aceite um array de payloads de webhook do Pipedrive. Isso permitirá o processamento de múltiplos eventos em uma única requisição.
Critérios de Aceite
O novo endpoint deve ser protegido pela mesma autenticação Basic Auth do endpoint individual.
O corpo da requisição deve ser um array de objetos, onde cada objeto segue a estrutura de um payload de webhook do Pipedrive (PipedriveWebhookPayloadDto).
O endpoint deve validar o array e cada um de seus elementos. Uma requisição com formato inválido deve ser rejeitada com um erro 400 Bad Request.
Para cada payload de webhook válido no array, um job individual deve ser adicionado à fila webhook-processing-queue.
A lógica de geração de jobId (para idempotência, usando meta.id) e jobName deve ser a mesma do endpoint individual.
O endpoint deve retornar uma resposta síncrona indicando que os jobs foram enfileirados, incluindo a quantidade de jobs recebidos e adicionados.
Decisões de Design
Processamento de Jobs: Cada webhook do lote será tratado como um job independente na fila do BullMQ. Isso isola falhas e simplifica a lógica de retry.
Consistência de Dados (update_time): A lógica de prevenção de atualizações com dados obsoletos (stale webhooks) no BaseUpsertStrategy será mantida como está. A comparação incomingUpdateTime <= existingEntity.pipedriveUpdateTime é robusta, simples e cobre todos os casos de webhooks fora de ordem, independentemente de serem do dia atual ou de dias anteriores. Nenhuma lógica adicional de data será implementada.
Validação de Payload: A validação do corpo da requisição usando Zod será mantida e estendida para o payload em lote. O custo de performance é mínimo e os benefícios de estabilidade e segurança (fail-fast) são críticos.