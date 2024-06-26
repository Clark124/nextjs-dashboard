'use server'

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"


const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({ invalid_type_error: '请选择一个客户名称' }),
    amount: z.coerce.number().gt(0, { message: "请输入一个大于0的数字" }),  //强制转换number
    status: z.enum(['pengding', 'paid'], { invalid_type_error: "请选择一个状态" }),
    date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })  //剔除

// 错误信息-类型描述（状态）
export type State = {
    errors?: {
        customerId?: string[],
        amount?: string[],
        status?: string[],
    },
    message?: string | null,
}


export async function createInvoice(preState: State, formData: FormData) {
    // throw new Error('Failed to create invoice')
    const rawFormData = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    }

    const validatedFileds = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    })

    if (!validatedFileds.success) {
        return {
            errors: validatedFileds.error.flatten().fieldErrors,
            message: "创建发票失败"
        }
    }

    const { customerId, amount, status } = validatedFileds.data

    const amountInCents = amount * 100
    const date = new Date().toISOString().split('T')[0]

    try {
        await sql`
        INSERT INTO invoices (customer_id,amount,status,date)
        values (${customerId},${amountInCents},${status},${date})
    `
    } catch (err) {
        return { message: "Database Error: insert fail" }
    }

    //告诉页面 数据更新了，要重新拿数据
    revalidatePath("/dashboard/invoices")
    redirect("/dashboard/invoices")
}


const UpdateInvoice = FormSchema.omit({ date: true, id: true })
export async function updateInvoice(id: string, formData: FormData) {
    //校验
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status")
    })
    const amountInCents = amount * 100

    //修改数据库
    await sql`
    update invoices set customer_id=${customerId},amount=${amountInCents},status=${status}
    where id=${id}
`
    //告诉页面 数据更新了，要重新拿数据
    revalidatePath("/dashboard/invoices")
    redirect("/dashboard/invoices")
}

export async function deleteInvoice(id: string) {
    await sql`
        delete from invoices where id=${id}
    `
    revalidatePath("/dashboard/invoices")
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return '登录失败，请检查用户名和密码';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }