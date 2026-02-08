// 统一的数字格式化函数
// 数值范围        │ formatValue (Tooltip)
// >= 1,000,000    │ 保留3位小数 + M（如1.234M）
// 1,000 - 999,999 │ 保留3位小数 + K（如1.234K）
// < 1,000         │ 保留3位小数（如123.456）
// 整数            │ 自动去除尾随.000（如123）

export const formatNumber = (value) => {
  // 检查是否为有效数字
  if (value == null || isNaN(value)) {
    return ''
  }

  let formattedValue

  if (value >= 1000000) {
    // 大于等于100万，格式化为M
    formattedValue = (value / 1000000).toFixed(3) + 'M'
  } else if (value >= 1000) {
    // 大于等于1000，格式化为K
    formattedValue = (value / 1000).toFixed(3) + 'K'
  } else {
    // 小于1000，直接保留3位小数
    formattedValue = value.toFixed(3)
  }

  // 去除尾随的.000
  return formattedValue.replace(/\.000([MK]?)$/, '$1')
}

// 格式化百分比的函数（保留2位小数）
export const formatPercentage = (value) => {
  if (value == null || isNaN(value)) {
    return ''
  }
  return value.toFixed(2) + '%'
}

// 格式化货币的函数（保留2位小数）
export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) {
    return ''
  }
  return '¥' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}