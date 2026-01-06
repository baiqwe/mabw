-- 1. 修复安全警告 (Mutable search_path)
-- 设置 search_path 防止恶意函数劫持
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.decrease_credits(uuid, integer, text) SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;

-- 2. 修复 RLS 权限问题
-- 之前的自动修复代码失败是因为缺少 INSERT 权限
DROP POLICY IF EXISTS "Users can insert their own customer data" ON public.customers;
CREATE POLICY "Users can insert their own customer data"
ON public.customers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. 【核心修复】直接在数据库层面补全缺失的 Customer 数据
-- 这将扫描所有已注册但没有 customer 记录的用户，并强制创建记录
INSERT INTO public.customers (user_id, email, credits, creem_customer_id, metadata)
SELECT 
    id, 
    email, 
    30, -- 默认赠送 30 积分
    'backfill_' || id::text, 
    '{"source": "sql_migration_fix"}'::jsonb
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.customers);

-- 4. 再次确认触发器配置 (防止未来注册出问题)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
