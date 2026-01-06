-- ============================================
-- Migration: Update signup bonus to 30 credits + Atomic deduct function
-- ============================================

-- 1. 修改 handle_new_user 函数，将赠送积分改为 30
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 创建 Customer 记录
  INSERT INTO public.customers (
    user_id,
    email,
    credits,
    creem_customer_id,
    created_at,
    updated_at,
    metadata
  ) VALUES (
    NEW.id,
    NEW.email,
    30, -- 30 积分注册礼
    'auto_' || NEW.id::text,
    NOW(),
    NOW(),
    jsonb_build_object(
      'source', 'auto_registration',
      'initial_credits', 30,
      'registration_date', NOW()
    )
  );

  -- 记录积分历史
  INSERT INTO public.credits_history (
    customer_id,
    amount,
    type,
    description,
    created_at,
    metadata
  ) VALUES (
    (SELECT id FROM public.customers WHERE user_id = NEW.id),
    30,
    'add',
    'Welcome bonus: 30 credits for new user',
    NOW(),
    jsonb_build_object(
      'source', 'welcome_bonus',
      'user_registration', true
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. 创建原子扣费函数 (防止并发刷成负数)
-- ============================================
CREATE OR REPLACE FUNCTION decrease_credits(
  p_user_id UUID, 
  p_amount INTEGER,
  p_description TEXT DEFAULT 'AI Generation'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id UUID;
  v_current_credits INTEGER;
BEGIN
  -- 锁定行并获取当前积分 (FOR UPDATE 防止并发)
  SELECT id, credits INTO v_customer_id, v_current_credits
  FROM customers
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- 检查用户是否存在
  IF v_customer_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 如果是退款 (负数金额)，直接执行
  IF p_amount < 0 THEN
    UPDATE customers
    SET 
      credits = credits - p_amount, -- 负负得正
      updated_at = NOW()
    WHERE id = v_customer_id;

    INSERT INTO credits_history (
      customer_id, amount, type, description, created_at, metadata
    ) VALUES (
      v_customer_id, ABS(p_amount), 'add', p_description, NOW(),
      jsonb_build_object('action', 'refund')
    );

    RETURN TRUE;
  END IF;

  -- 检查余额是否不足
  IF v_current_credits < p_amount THEN
    RETURN FALSE;
  END IF;

  -- 执行扣费
  UPDATE customers
  SET 
    credits = credits - p_amount,
    updated_at = NOW()
  WHERE id = v_customer_id;

  -- 写入流水日志
  INSERT INTO credits_history (
    customer_id,
    amount,
    type,
    description,
    created_at,
    metadata
  ) VALUES (
    v_customer_id,
    p_amount,
    'subtract',
    p_description,
    NOW(),
    jsonb_build_object('action', 'ai_generation')
  );

  RETURN TRUE;
END;
$$;

-- 授权 authenticated 用户可以调用此函数
GRANT EXECUTE ON FUNCTION decrease_credits TO authenticated;
